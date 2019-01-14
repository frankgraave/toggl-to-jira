<template>
  <div>
    <aside class="menu is-pulled-left">
      <ul class="menu-list">
        <li>
          <router-link class="button is-medium" to="/accounts">
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
        <li>
          <div id="spinner" class="orbit-spinner">
            <div class="orbit"></div>
            <div class="orbit"></div>
            <div class="orbit"></div>
          </div>
        </li>
      </ul>
    </aside>

    <div id="app">
      <nav class="navbar is-fixed-top" role="navigation">
        <div class="level-left">
          <!-- Local navigation items for /timers -->
          <template v-if="this.$route.path === '/'">
            <p class="navbar-item">
              <router-link to="#">
                <span class="icon is-small"><i><fa icon="sync-alt"></fa></i></span>
                <span v-on:click="getTogglData">Refresh</span>
              </router-link>
              <router-link to="#">
                <span class="icon is-small"><i><fa icon="external-link-square-alt"></fa></i></span>
                <span v-on:click="open('https://toggl.com/app/timer')">Open Toggl</span>
              </router-link>
            </p>
          </template>

          <!-- Local navigation items for /settings -->
          <template v-if="this.$route.path === '/settings'">
            <p class="navbar-item">
              <router-link to="/accounts">
                <span class="icon is-small"><i><fa :icon="['fas', 'users']" /></i></span>
                <span v-on:click="">Accounts</span>
              </router-link>
            </p>
          </template>

          <!-- Local navigation items for /jira-board-settings -->
          <template v-if="this.$route.path === '/accounts'">
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
  import $ from 'jquery'

  // Hide our spinner by default.
  $('#spinner').hide()

  export default {
    name: 'toggl-to-jira',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      getTogglData () {
        this.$electron.ipcRenderer.send('getTogglData')
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
  nav.navbar.is-fixed-top {
    background-color: #1a2736;
    box-shadow: 0 8px 16px rgba(10, 10, 10, 0.2);
    padding: 0.5rem 0;
    left: 70px;
  }
  p.navbar-item a span:after,
  p.navbar-item a:after,
  p.navbar-item a span.icon {
    content: "\00a0";
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
    top: 3.5rem;
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

  #spinner {
    bottom: 16px;
    left: 16px;
    position: absolute;
    display: none;
  }
  .orbit-spinner, .orbit-spinner * {
    box-sizing: border-box;
  }

  .orbit-spinner {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    perspective: 800px;
  }

  .orbit-spinner .orbit {
    position: absolute;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }

  .orbit-spinner .orbit:nth-child(1) {
    left: 0%;
    top: 0%;
    animation: orbit-spinner-orbit-one-animation 1300ms linear infinite;
    border-bottom: 3px solid #00adb5;
  }

  .orbit-spinner .orbit:nth-child(2) {
    right: 0%;
    top: 0%;
    animation: orbit-spinner-orbit-two-animation 1300ms linear infinite;
    border-right: 3px solid #00adb5;
  }

  .orbit-spinner .orbit:nth-child(3) {
    right: 0%;
    bottom: 0%;
    animation: orbit-spinner-orbit-three-animation 1300ms linear infinite;
    border-top: 3px solid #00adb5;
  }

  @keyframes orbit-spinner-orbit-one-animation {
    0% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
    }
  }

  @keyframes orbit-spinner-orbit-two-animation {
    0% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
    }
  }

  @keyframes orbit-spinner-orbit-three-animation {
    0% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
    }
    100% {
      transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
    }
  }
</style>
