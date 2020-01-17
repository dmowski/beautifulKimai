import { writable } from "svelte/store";
import credentials from "./credentialsStore";
import kimaiApi from "../kimaiApi";

function checkForError(result, consoleMessage) {
  if (result.code === 400) {
    alert("Save error: " + result.message);
  }

  console.log(consoleMessage, result);
}

function createReportsStore() {
  const { subscribe, set, update } = writable([]);
  let urlAPI = "";
  let headers = {};

  credentials.subscribe(newCredentials => {
    if (!newCredentials) {
      return;
    }
    urlAPI = newCredentials.urlAPI;
    headers = newCredentials.headers;
  });

  return {
    subscribe,
    saveReport: async function(id, reportObject) {
      if (!id) {
        return;
      }
      const result = await kimaiApi.saveReport(
        urlAPI,
        headers,
        id,
        reportObject
      );
      checkForError(result, "result of updating");
      return this.getReportList();
    },
    saveNewReport: async function(reportObject) {
      const result = await kimaiApi.createReport(urlAPI, headers, reportObject);
      checkForError(result, "result of saving new");
      return this.getReportList();
    },

    deleteReport: async function(id) {
      if (!id) {
        return;
      }
      const result = await kimaiApi.deleteReport(urlAPI, headers, id);
      checkForError(result, "result of delete");
      return this.getReportList();
    },

    getReportList: async function() {
      window.reports = await kimaiApi.getAllReports(urlAPI, headers);

      update(() => {
        return window.reports;
      });
    }
  };
}

const reports = createReportsStore();
export default reports;
