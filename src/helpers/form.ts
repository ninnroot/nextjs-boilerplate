export const setFormErrrors = (mutationErorrObject: any, formInstance: any) => {
  Object.keys(mutationErorrObject?.response?.data?.details)?.map((e) => {
    formInstance.setError(e, {
      message: mutationErorrObject?.response?.data?.details[e].join(),
    });
  });
};
