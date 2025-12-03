function isNetworkError(err) {
    return !!err.isAxiosError && !err.response;
  }