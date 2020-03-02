<script>
  import converter from "./converters";
  import Datepicker from "svelte-calendar";
  import dayjs from "dayjs";

  import reports from "./store/reportsStore.js";
  import activities from "./store/activitiesStore.js";
  import projects from "./store/projectsStore.js";
  import customers from "./store/customersStore.js";

  export let report;
  import { beforeUpdate, afterUpdate, onMount } from "svelte";
  const convertReportToSendFormat = reportObject => {
    const startDateStr = converter.date.toSrc(reportObject.date);
    const startDate = new Date(startDateStr);
    const duration = converter.duration.toSrc(
      reportObject.hours,
      reportObject.minutes
    );
    const endData = new Date(startDate.getTime() + duration * 1000);
    const endDateStr = converter.date.toSrc(endData.toString());
    return Object.assign(
      {},
      {
        begin: startDateStr,
        end: endDateStr,
        project: reportObject.projectId,
        activity: reportObject.activityId,
        description: reportObject.description,
        tags: ""
      }
    );
  };

  let saveAsToday = async e => {
    e.preventDefault();
    const todayDayObj = new Date();
    const todayString = todayDayObj.toISOString().split("T")[0];

    const todayObj = Object.assign({}, reportInEditMode, {
      date: converter.date.toSrc(todayString)
    });
    const reportForSend = convertReportToSendFormat(todayObj);
    await reports.saveNewReport(reportForSend);
  };

  let saveAsNew = async e => {
    e.preventDefault();
    const reportForSend = convertReportToSendFormat(reportInEditMode);
    await reports.saveNewReport(reportForSend);
  };

  let saveThisReport = async e => {
    e.preventDefault();
    const reportForSend = convertReportToSendFormat(reportInEditMode);
    await reports.saveReport(reportInEditMode.id, reportForSend);
  };

  let deleteReport = async e => {
    e.preventDefault();
    const needDelete = confirm("Delete report?");
    if (!needDelete) {
      return;
    }

    await reports.deleteReport(reportInEditMode.id);
  };

  beforeUpdate(() => {
    if (report.id !== reportInEditMode.id) {
      reportInEditMode.id = report.id;

      reportInEditMode.description = report.description;
      reportInEditMode.date = converter.date.toView(report.begin);

      reportInEditMode.hours = converter.duration.getHours(report.duration);
      reportInEditMode.minutes = converter.duration.getMinutes(report.duration);

      reportInEditMode.projectId = report.project.id;
      reportInEditMode.activityId = report.activity.id;
      reportInEditMode.customerId = report.project.customer.id;
    }
  });
  const reportInEditMode = {};
  function skip(e) {
    e.preventDefault();
  }
</script>

<style>
  textarea {
    width: 100%;
    height: 150px;
  }
  span {
    min-width: 100px;
    display: inline-block;
  }
  .time {
    width: 70px;
  }

  .time + i {
    padding-right: 10px;
  }
  select {
    width: 100%;
  }

  .button-color-fail {
    float: right;
  }
  .row {
    display: block;
    display: flex;
  }
  .row-category {
    justify-content: space-between;
  }
  .row label {
    width: calc(33.333% - 15px);
  }
  .date-picker {
    padding-right: 15px;
  }
</style>

<div>
  <form>
    <label>
      <span>Description:</span>
      <br />
      <textarea bind:value={reportInEditMode.description} name="description" />
    </label>
    <br />
    <div class="row">
      <div class="date-picker">
        <span>Date:</span>
        <br />
        <Datepicker
          selected={new Date(reportInEditMode.date)}
          bind:formattedSelected={reportInEditMode.date}
          format={date => dayjs(date).format('YYYY-MM-DD')}
          style="--button-border-color: #ccc;">
          <button on:click={skip} class="date-picker-button input-field">
            {reportInEditMode.date}
          </button>
        </Datepicker>
      </div>
      <div>
        <span>Time:</span>
        <br />
        <input
          class="time"
          bind:value={reportInEditMode.hours}
          min="0"
          type="number"
          name="duration" />
        <i>h</i>
        <input
          class="time"
          min="0"
          bind:value={reportInEditMode.minutes}
          type="number"
          name="duration" />
        <i>m</i>
      </div>

    </div>
    <br />
    <div class="row row-category">
      <label>
        <span>Customer:</span>
        <br />
        <select bind:value={reportInEditMode.customerId}>
          {#each $customers as customer}
            <option value={customer.id}>{customer.name}</option>
          {/each}
        </select>
      </label>

      <label>
        <span>Project:</span>
        <br />
        <select bind:value={reportInEditMode.projectId}>
          {#each $projects as project}
            {#if project.customer === reportInEditMode.customerId}
              <option value={project.id}>{project.name}</option>
            {/if}
          {/each}
        </select>
      </label>

      <label>
        <span>Activity:</span>
        <br />
        <select bind:value={reportInEditMode.activityId}>
          {#each $activities as activity}
            {#if !activity.project || activity.project === reportInEditMode.projectId}
              <option value={activity.id}>{activity.name}</option>
            {/if}
          {/each}
        </select>
      </label>

    </div>

    <br />
    <div class="buttons">
      <button on:click={saveThisReport} class="button-color button-color-fill">
        Update
      </button>
      <button on:click={saveAsNew} class="button-color">Create new</button>
      <button on:click={deleteReport} class="button-color button-color-fail">
        Delete
      </button>
    </div>
  </form>
</div>
