export interface paths {
  "/projects": {
    get: {
      parameters: {
        query?: {
          page?: number;
          size?: number;
          keyword?: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["PageResultProjectDTO"];
          };
        };
      };
    };
    post: {
      requestBody: {
        content: {
          "application/json": components["schemas"]["ProjectCreateReq"];
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["ProjectDTO"];
          };
        };
      };
    };
  };
  "/projects/{id}": {
    get: {
      parameters: {
        path: {
          id: string;
        };
      };
      responses: {
        200: {
          content: {
            "application/json": components["schemas"]["ProjectDTO"];
          };
        };
      };
    };
  };
}

export interface components {
  schemas: {
    ProjectDTO: {
      id: string;
      name: string;
      description?: string;
      status: "ACTIVE" | "ARCHIVED";
      createdAt: string;
      updatedAt: string;
    };
    ProjectCreateReq: {
      name: string;
      description?: string;
    };
    PageResultProjectDTO: {
      list: components["schemas"]["ProjectDTO"][];
      total: number;
      page: number;
      size: number;
    };
  };
}
