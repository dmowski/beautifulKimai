<script>
  export let report;
  import converter from "./converters";
  export let isSelectedReport = false;
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function selectReport(event) {
    if (report.id) {
      dispatch("select", {
        id: report.id
      });
    }
  }
</script>

<style>
  article {
    border: 1px solid #aaa;
    border-radius: 2px;
    padding: 10px 15px;
    margin: 5px 0;
    display: grid;
    grid-template-columns: 65% 10% 1fr 50px;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
  }
  .article_selected {
    background-color: #444;
    border: 1px solid #444;
    color: white;
  }

  article:hover {
    border: 1px solid #444;
  }
  .duration {
    text-align: center;
  }
  p {
    margin: 0;
  }
</style>

<article
  on:click={selectReport}
  class={isSelectedReport ? `article_selected` : ''}>
  <p class="description">{report.description || ''}</p>
  <p class="project">{report.project.name || ''}</p>
  <p class="activity">{report.activity.name || ''}</p>
  <!--p class="date">
    <i>{converter.date.toView(report.end)}</i>
  </p-->
  <p class="duration">{converter.duration.toView(report.duration)}</p>
</article>
