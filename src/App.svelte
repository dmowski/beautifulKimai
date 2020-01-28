<script>
  import Login from "./Login.svelte";
  import Reports from "./Reports.svelte";
  import credentials from "./store/credentialsStore.js";

  function logout() {
    credentials.logout();
  }
</script>

<style>
  .logout {
    position: fixed;
    right: 10px;
    top: 10px;
    z-index: 1;
  }
</style>

<main>
  {#if $credentials === null}
    <Login />
  {:else}
    <button class="logout button-color button-color-fail" on:click={logout}>
      Logout
    </button>
    <Reports />
  {/if}
</main>
