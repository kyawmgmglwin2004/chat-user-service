class HttpStatusCodes {
  static OK(data: any, message?: string) {
    return {
      code: "200",
      status: "OK",
      message: message || "No Error",
      data: data || undefined,
    };
  }

  static SEE_OTHER(url: string, message?: string) {
    return {
      code: "303",
      status: "SEE_OTHER",
      message: message || "Please follow the URL provided",
      url: url || undefined,
    };
  }

  static REDIRECT(url: string, message?: string) {
    return {
      code: "303",
      status: "SEE_OTHER",
      message: message || "Please follow the URL provided",
      url: url || undefined,
    };
  }

  static INVALID_ARGUMENT(message?: string) {
    return {
      code: "400",
      status: "INVALID_ARGUMENT",
      message: message || "Client specified an invalid argument",
    };
  }

  static UNAUTHENTICATED(message?: string) {
    return {
      code: "401",
      status: "UNAUTHENTICATED",
      message: message || "Request is not authenticated",
    };
  }

  static PERMISSION_DENIED(message?: string) {
    return {
      code: "403",
      status: "PERMISSION_DENIED",
      message: message || "Permission denied",
    };
  }

  static NOT_FOUND(message?: string) {
    return {
      code: "404",
      status: "NOT_FOUND",
      message: message || "A specified resource is not found",
    };
  }

  static ALREADY_EXISTS(message?: string) {
    return {
      code: "409",
      status: "ALREADY_EXISTS",
      message: message || "Resource already exists",
    };
  }

  static RESOURCE_EXHAUSTED(message?: string) {
    return {
      code: "429",
      status: "RESOURCE_EXHAUSTED",
      message: message || "Out of resource",
    };
  }

  static CANCELLED(message?: string) {
    return {
      code: "499",
      status: "CANCELLED",
      message: message || "Request cancelled by the client",
    };
  }

  static UNKNOWN(message?: string) {
    return {
      code: "500",
      status: "UNKNOWN",
      message: message || "Unknown Server Error",
    };
  }

  static NOT_IMPLEMENTED(message?: string) {
    return {
      code: "501",
      status: "NOT_IMPLEMENTED",
      message: message || "API method is not implemented by the server",
    };
  }

  static UNAVAILABLE(message?: string) {
    return {
      code: "503",
      status: "UNAVAILABLE",
      message: message || "Service unavailable",
    };
  }

  static DEADLINE_EXCEEDED(message?: string) {
    return {
      code: "504",
      status: "DEADLINE_EXCEEDED",
      message: message || "Request deadline exceeded",
    };
  }
}

export default HttpStatusCodes;
