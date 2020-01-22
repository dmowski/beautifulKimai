<script>
  import reports from "./store/reportsStore.js";
  import PreviewReport from "./PreviewReport.svelte";
  import ReportEditor from "./ReportEditor.svelte";
  import converter from "./converters";

  import { onMount } from "svelte";
  let daysBlock = [];

  $: selectedReport = null;

  function userSelectReport(event) {
    const selectedId = event.detail.id;
    selectedReport = $reports.find(report => report.id == selectedId);
  }

  function getDuration(reports) {
    const globalDuration = reports.reduce((duration, report) => {
      return duration + report.duration;
    }, 0);
    return converter.duration.toView(globalDuration);
  }
  function refreshSelectReport() {
    const isExistSelectedReport =
      selectedReport &&
      $reports.find(report => {
        return report.id === selectedReport.id;
      });

    if (!isExistSelectedReport) {
      selectedReport =
        $reports.find(report => {
          return report.id;
        }) || null;
    }
  }
  onMount(async () => {
    const todayDayObj = new Date();
    const todayString = todayDayObj.toISOString().split("T")[0];
    reports.subscribe(reports => {
      if (!reports) {
        return;
      }

      const listOfDays = [
        ...new Set(
          reports.map(report => {
            return converter.date.toView(report.end);
          })
        )
      ].sort((dayA, dayB) => {
        var a = new Date(dayA).getTime();
        var b = new Date(dayB).getTime();
        if (a > b) {
          return -1;
        }
        if (a < b) {
          return 1;
        }
        return 0;
      });

      daysBlock = listOfDays.map(day => {
        const listOfReports = reports.filter(report => {
          const reportDay = converter.date.toView(report.end);
          return reportDay === day;
        });

        const afterTitle = day === todayString ? " (Today)" : "";

        return {
          title: day + afterTitle,
          reports: listOfReports
        };
      });
      refreshSelectReport();
    });
    await reports.getReportList();
    refreshSelectReport();
  });
</script>

<style>
  .list {
    width: 50%;
    padding: 0 0 10px 10px;
    box-sizing: border-box;
  }

  .report-editor {
    box-sizing: border-box;
    padding: 10px;
    padding-left: 30px;
    width: 50%;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }
  .day-block {
    border-radius: 10px 0 0 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-right: none;
    margin: 14px 0;
    box-sizing: border-box;
    padding: 20px;
  }
  .day-title {
    margin: 0;
  }
  span {
    color: #999;
  }
</style>

<div class="list">
  <h2>Reports</h2>
  {#each daysBlock as dayBlock, i}
    <div class="day-block">
      <p class="day-title">
        <b>{dayBlock.title}</b>
        <span>• {getDuration(dayBlock.reports)}</span>
      </p>
      {#each dayBlock.reports as report, i}
        <PreviewReport
          {report}
          isSelectedReport={selectedReport && selectedReport.id === report.id}
          on:select={userSelectReport} />
      {/each}
    </div>
  {/each}
</div>

<div class="report-editor">
  <h2>Editor</h2>

  {#if selectedReport !== null}
    <ReportEditor report={selectedReport} />
  {:else}
    <p>Need select report</p>
  {/if}
</div>
