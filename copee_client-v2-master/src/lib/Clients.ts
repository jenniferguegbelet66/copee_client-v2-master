import {
  COPEE_APPLI_CLIENT,
  COPEE_APPLI_CLIENT_LIST,
} from "@/components/store/types";

export class Clients {
  private clients: COPEE_APPLI_CLIENT_LIST = [];

  constructor(initialClients: COPEE_APPLI_CLIENT_LIST) {
    this.clients = initialClients;
  }

  addClient(client: COPEE_APPLI_CLIENT) {
    this.clients.push(client);
  }

  findClientById(clientId: number): COPEE_APPLI_CLIENT | undefined {
    return this.clients.find((client) => client.client_id === clientId);
  }

  getAllClients(): COPEE_APPLI_CLIENT_LIST {
    return this.clients;
  }

  removeClientById(clientId: number) {
    this.clients = this.clients.filter(
      (client) => client.client_id !== clientId
    );
  }
}
