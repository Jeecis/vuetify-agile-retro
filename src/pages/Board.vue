<template>
  <v-container fluid>
    <h1 class="mb-4 text-center">{{ boardName }}</h1>
    <v-row>
      <v-col
        v-for="(column, columnIndex) in columns"
        :key="column.id"
        cols="12"
        md="4"
      >
        <v-card class="pa-3 mb-6" min-height="500px" variant="outlined">
          <v-card-title>{{ column.title }}</v-card-title>

          <!-- Add new card input -->
          <v-card-text>
            <v-text-field
              v-model="newCardTexts[columnIndex]"
              label="Add a new card"
              append-icon="mdi-plus"
              hide-details
              class="mb-3"
              @click:append="addCard(columnIndex)"
              @keyup.enter="addCard(columnIndex)"
              variant="outlined"
            />
          </v-card-text>

          <!-- Draggable cards list -->
          <v-card-text class="pt-0">
            <draggable
              v-model="column.cards"
              :group="{ name: 'cards' }"
              :component-data="{
                tag: 'div',
                type: 'transition-group',
                name: !drag ? 'flip-list' : null,
              }"
              handle=".drag-handle"
              class="list-group"
              ghost-class="ghost-card"
              :animation="200"
              @end="onDragEnd"
              :data-column-index="columnIndex"
            >
              <template #item="{ element: card, index: cardIndex }">
                <div :key="card.position">
                  <v-card
                    class="mb-3 pa-3 card-hover"
                    variant="outlined"
                    @click="openCardModal(columnIndex, cardIndex, card)"
                  >
                    <div class="d-flex justify-space-between align-center">
                      <div>{{ card.description }}</div>
                      <div class="d-flex align-center">
                        <v-btn
                          icon
                          small
                          class="mr-1"
                          @click.stop="likeCard(columnIndex, cardIndex)"
                        >
                          <v-icon :color="card.liked ? 'red' : undefined">
                            {{ card.liked ? "mdi-heart" : "mdi-heart-outline" }}
                          </v-icon>
                        </v-btn>
                        <span class="mr-3">{{ card.likes }}</span>
                        <v-icon size="large" class="drag-handle"
                          >mdi-drag</v-icon
                        >
                      </div>
                    </div>
                  </v-card>
                </div>
              </template>
            </draggable>

            <div v-if="column.cards.length === 0" class="text-center text-grey">
              No cards yet
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Card Modal -->
    <v-dialog v-model="isModalOpen" max-width="500px">
      <v-card v-if="selectedCard">
        <v-card-title class="text-h5"> Card Details </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="selectedCard.description"
            label="Description"
            variant="outlined"
          ></v-text-field>

          <div class="d-flex align-center mt-4">
            <v-icon
              class="mr-2"
              :color="selectedCard.liked ? 'red' : undefined"
            >
              {{ selectedCard.liked ? "mdi-heart" : "mdi-heart-outline" }}
            </v-icon>
            <span>{{ selectedCard.likes }} likes</span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteSelectedCard">Delete</v-btn>
          <v-btn color="primary" @click="saveCardChanges">Save</v-btn>
          <v-btn color="secondary" @click="closeModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },

  data() {
    return {
      boardName: "Agile Board",
      columns: [
        {
          id: 1,
          title: "What went well?",
          cards: [],
        },
        {
          id: 2,
          title: "What went wrong?",
          cards: [],
        },
        {
          id: 3,
          title: "What can be improved?",
          cards: [],
        },
      ],
      newCardTexts: ["", "", ""],
      nextCardId: 1,
      // Properties for modal
      isModalOpen: false,
      selectedCard: null,
      selectedCardIndices: { column: -1, card: -1 },
      drag: false,
      // WebSocket properties
      socket: null,
      boardId: this.$route.params.id || "default-board", // Replace with actual board ID or parameter
      connected: false,
      moveRecordCalled: false,
    };
  },

  methods: {
    // WebSocket methods
    initWebSocket() {
      // Adjust the WebSocket URL as needed for your environment
      const boardId = this.$route.params.id || "N9D27E";
      const wsUrl = `ws://localhost:8080/api/v1/board/${boardId}/ws`;
      console.log("Connecting to WebSocket:", wsUrl);
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = this.onSocketOpen;
      this.socket.onmessage = this.onSocketMessage;
      this.socket.onclose = this.onSocketClose;
      this.socket.onerror = this.onSocketError;
    },

    onSocketOpen() {
      console.log("WebSocket connection established");
      this.connected = true;

      // Join the board to get initial data
      this.sendMessage("join_board", {
        id: this.boardId,
      });
    },

    onSocketClose(event) {
      console.log("WebSocket connection closed", {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
      });
      this.connected = false;

      // Reconnect logic
      setTimeout(() => {
        this.initWebSocket();
      }, 3000);
    },

    onSocketError(error) {
      console.error("WebSocket error:", error);
    },

    onSocketMessage(event) {
      try {
        const message = JSON.parse(event.data);

        switch (message.action) {
          case "join_board":
            this.handleInitBoard(message.payload);
            break;
          case "create_record":
            this.handleCreateRecord(message.payload);
            break;
          case "update_record":
            this.handleUpdateRecord(message.payload);
            break;
          case "delete_record":
            this.handleDeleteRecord(message.payload);
            break;
          case "move_record":
            this.handleMoveRecord(message.payload);
            break;
          default:
            console.log("Unknown message action:", message.action);
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    },

    sendMessage(action, payload) {
      if (this.connected && this.socket) {
        this.socket.send(
          JSON.stringify({
            action: action,
            payload: payload,
          })
        );
      } else {
        console.warn("Cannot send message, WebSocket not connected");
      }
    },

    // WebSocket message handlers
    handleInitBoard(boardData) {
      this.boardName = boardData.board.name;
      // Transform the received board data to match our component's structure
      this.columns = boardData.columns.map((column) => ({
        id: column.column.column_id,
        title: column.column.name,
        cards: column.records
          .sort((a, b) => a.position - b.position)
          .map((record) => ({
            id: record.record_id,
            description: record.text,
            likes: record.likes,
            liked: false, // This info is not available from server, default to false
            position: record.position,
            columnId: record.column_id,
          })),
      }));

      // Reset new card input fields
      this.newCardTexts = Array(this.columns.length).fill("");
    },

    handleCreateRecord(record) {
      // Find the column and add the new card
      const columnIndex = this.columns.findIndex(
        (col) => col.id === record.column_id
      );
      if (columnIndex !== -1) {
        const newCard = {
          id: record.record_id,
          description: record.text,
          likes: record.likes || 0,
          liked: false,
          position: record.position,
        };
        this.columns[columnIndex].cards.push(newCard);
      }
    },

    handleUpdateRecord(record) {
      console.log("Update record:", record);
      // Find the card and update it
      const columnIndex = this.columns.findIndex(
        (col) => col.id === record.column_id
      );
      if (columnIndex !== -1) {
        const cardIndex = this.columns[columnIndex].cards.findIndex(
          (card) => card.id === record.record_id
        );

        if (cardIndex !== -1) {
          // Update existing card
          this.columns[columnIndex].cards[cardIndex].description = record.text;
          this.columns[columnIndex].cards[cardIndex].likes = record.likes;
        }
      }
    },

    handleMoveRecord(record) {
      if (this.moveRecordCalled) {
        this.moveRecordCalled = false; // Reset the flag
        return;
      }
      const columnIndex = this.columns.findIndex(
        (col) => col.id === record.source_column_id
      );
      if (columnIndex !== -1) {
        const cardIndex = this.columns[columnIndex].cards.findIndex(
          (card) => card.id === record.record_id
        );

        // append card to the target column
        const targetColumnIndex = this.columns.findIndex(
          (col) => col.id === record.target_column_id
        );

        let movedCard;
        if (targetColumnIndex !== -1) {
          movedCard = this.columns[columnIndex].cards.splice(cardIndex, 1)[0];
          this.columns[targetColumnIndex].cards.push(movedCard);
        }

        this.columns[targetColumnIndex].cards.sort(
          (a, b) => a.position - b.position
        );
      }
    },

    handleDeleteRecord(deleteData) {
      // Find and remove the deleted card
      this.columns.forEach((column) => {
        const cardIndex = column.cards.findIndex(
          (card) => card.id === deleteData.id
        );
        if (cardIndex !== -1) {
          column.cards.splice(cardIndex, 1);
        }
      });
    },

    // Modified existing methods to integrate with WebSocket
    addCard(columnIndex) {
      const text = this.newCardTexts[columnIndex].trim();
      if (text) {
        // Send the create record message to the server
        this.sendMessage("create_record", {
          id: this.boardId,
          column_id: this.columns[columnIndex].id,
          text: text,
        });

        this.newCardTexts[columnIndex] = "";
        // Note: We don't add the card directly here anymore,
        // it will be added when we receive the create_record response
      }
    },

    openCardModal(columnIndex, cardIndex, card) {
      this.isModalOpen = true;
      this.selectedCard = { ...card }; // Create a copy to avoid direct mutation
      this.selectedCardIndices = { column: columnIndex, card: cardIndex };
    },

    closeModal() {
      this.isModalOpen = false;
      this.selectedCard = null;
      this.selectedCardIndices = { column: -1, card: -1 };
    },

    deleteSelectedCard() {
      if (
        this.selectedCard &&
        this.selectedCardIndices.column !== -1 &&
        this.selectedCardIndices.card !== -1
      ) {
        this.removeCard(
          this.selectedCardIndices.column,
          this.selectedCardIndices.card
        );
        this.closeModal();
      }
    },

    removeCard(columnIndex, cardIndex) {
      const cardId = this.columns[columnIndex].cards[cardIndex].id;

      // Send delete message to server
      this.sendMessage("delete_record", {
        id: cardId,
      });

      // We could remove it locally immediately for better UX
      this.columns[columnIndex].cards.splice(cardIndex, 1);
    },

    likeCard(columnIndex, cardIndex) {
      const card = this.columns[columnIndex].cards[cardIndex];
      card.liked = !card.liked;
      card.likes += card.liked ? 1 : -1;

      // Send update message to server
      this.sendMessage("update_record", {
        id: this.boardId,
        column_id: this.columns[columnIndex].id,
        record_id: card.id,
        text: card.description,
        likes: card.likes,
        position: card.position || 0,
      });
    },

    saveCardChanges() {
      if (this.selectedCard && this.selectedCardIndices.column !== -1) {
        const { column, card } = this.selectedCardIndices;
        const updatedCard = this.columns[column].cards[card];

        // Update local state
        updatedCard.description = this.selectedCard.description;

        // Send update to server
        this.sendMessage("update_record", {
          id: this.boardId,
          column_id: this.columns[column].id,
          record_id: updatedCard.id,
          text: updatedCard.description,
          likes: updatedCard.likes,
          position: updatedCard.position || 0,
        });

        this.closeModal();
      }
    },

    // Drag and drop handling
    onDragEnd(event) {
      // Update the selected card indices if the modal is open
      if (this.isModalOpen && this.selectedCard) {
        const newColumnIndex = event.to.dataset.columnIndex;
        const newCardIndex = event.newIndex;

        // Update the indices to reflect the new position
        this.selectedCardIndices = {
          column: parseInt(newColumnIndex),
          card: newCardIndex,
        };
      }

      // Handle dragged card (moved between columns or reordered)
      if (event.from !== event.to || event.oldIndex !== event.newIndex) {
        const fromColumnIndex = parseInt(event.from.dataset.columnIndex);
        const toColumnIndex = parseInt(event.to.dataset.columnIndex);

        const movedCard = this.columns[toColumnIndex].cards[event.newIndex];

        // Calculate new position (simple approach)
        let newPosition = event.newIndex;

        // Send move message to server
        this.moveRecordCalled = true;
        this.sendMessage("move_record", {
          record_id: movedCard.id,
          source_column_id: this.columns[fromColumnIndex].id,
          target_column_id: this.columns[toColumnIndex].id,
          old_position: event.oldIndex,
          new_position: newPosition,
        });
      }

      this.drag = false;
    },
  },
  mounted() {
    console.log("mounted");
    this.initWebSocket();
  },

  beforeUnmount() {
    if (this.socket && this.connected) {
      this.socket.close(1000, "Client is leaving");
    }
  },
};
</script>

<style scoped>
.v-card {
  transition: all 0.3s;
}

.card-hover {
  cursor: pointer;
}

.card-hover:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.ghost-card {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  min-height: 20px;
}

.drag-handle {
  cursor: move;
}

.flip-list-move {
  transition: transform 0.5s;
}
</style>
