export const downloadCsv = (data: any, filename = "data.csv") => {
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    downloadFile(url, filename);
  };
  
  export const downloadFile = (url: string, filename: string) => {
    const fakeATag = document.createElement("a") as HTMLAnchorElement;
    fakeATag.href = url;
    fakeATag.download = filename;
    fakeATag.target = "_blank";
    document.body.appendChild(fakeATag);
    fakeATag.click();
    fakeATag?.parentNode && fakeATag.parentElement?.removeChild(fakeATag);
  };