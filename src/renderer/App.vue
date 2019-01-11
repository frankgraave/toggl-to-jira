<template>
  <div>
    <aside class="menu is-pulled-left">
      <ul class="menu-list">
        <li>
          <router-link class="button is-medium" to="/index">
            <span class="icon"><i><fa icon="user-circle"></fa></i></span>
          </router-link>
        </li>
        <li>
          <router-link class="button is-medium" to="/timers">
            <span class="icon"><i><fa icon="power-off"></fa></i></span>
          </router-link>
        </li>
        <li>
          <router-link class="button is-medium" to="/settings">
            <span class="icon"><i><fa icon="cog"></fa></i></span>
          </router-link>
        </li>
      </ul>
    </aside>

    <div id="app">
      <nav class="navbar" role="navigation">
        <div class="level-left">
          <!-- Local navigation items for /index -->
          <template v-if="this.$route.path === '/index'">
            <p class="navbar-item">
              <router-link to="#">
                <span class="icon is-small"><i><fa icon="trash"></fa></i></span>
                <span v-on:click="clearCredentials">Clear credentials</span>
              </router-link>
            </p>
          </template>

          <!-- Local navigation items for /timers -->
          <template v-if="this.$route.path === '/'">
            <p class="navbar-item">
              <router-link to="#">
                <span class="icon is-small"><i><fa icon="sync-alt"></fa></i></span>
                <span v-on:click="">Refresh</span>
              </router-link>
              &nbsp;
              <router-link to="#">
                <span class="icon is-small"><i><fa icon="external-link-square-alt"></fa></i></span>
                <span v-on:click="open('https://toggl.com/app/timer')">Open Toggl</span>
              </router-link>
            </p>
          </template>

          <!-- Local navigation items for /settings -->
          <template v-if="this.$route.path === '/settings'">
            <p class="navbar-item">
              <router-link to="/jira-board-settings">
                <span class="icon is-small"><i><fa :icon="['fab', 'jira']" /></i></span>
                <span v-on:click="">Jira Boards</span>
              </router-link>
            </p>
          </template>

          <!-- Local navigation items for /jira-board-settings -->
          <template v-if="this.$route.path === '/jira-board-settings'">
            <p class="navbar-item">
              <router-link to="/settings">
                <span class="icon is-small"><i><fa icon="arrow-left"></fa></i></span>
                <span v-on:click="">Settings</span>
              </router-link>
            </p>
          </template>

        </div>
      </nav>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'toggl-to-jira',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      clearCredentials () {
        this.$electron.ipcRenderer.send('clearCredentials')
      }
    }
  }
</script>

<style>
  body::-webkit-scrollbar {
    display: none;
  }
  nav.navbar {
    background-color: #1a2736;
    box-shadow: 0 8px 16px rgba(10, 10, 10, 0.2);
    padding: 0.5rem 0;
  }
  .navbar-item a {
    color: #999999;
  }
  .navbar-item a:hover {
    color: #00adb5;
  }
  #app {
    position: relative;
    left: 70px;
  }
  section.section {
    padding: 1.5rem;
  }
  aside {
    background-color: #13171c;
    height: 100vh;
    width: 70px;
    position: fixed;
    z-index: 1000;
    float: left;
  }
  aside .menu-list .button {
    border-radius: 0;
    border: none;
    background: transparent;
    line-height: 45px;
    cursor: pointer;
    height: 65px;
    width: 100%;
  }
  aside ul li a.button {
    color: #999999;
  }
  aside ul li a.button:visited,
  aside ul li a.button:link {
    color: #999999;
  }
  aside ul li a.button:hover {
    background-color: #13171c !important;
    color: #00adb5 !important;
    outline: unset;
    border: unset;
  }
</style>
