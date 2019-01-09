<template>
  <div>
    <template v-if="togglEntriesData === null">
      <div class="column is-11">
        <article class="message is-success">
          <div class="message-header">Notice</div>
          <div class="message-body">
            You're all done! Have a great day.
          </div>
        </article>
      </div>
    </template>
    <template v-else>
      <section class="section is-paddingless">
        <div class="table is-fullwidth is-striped">
          <thead>
          <tr>
            <th width="5%">Ticket</th>
            <th width="23%">Description</th>
            <th width="1%">Duration</th>
            <th width="2%">Date</th>
            <th width="9%">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>OSSUPPORT-1928</td>
            <td>This is a description</td>
            <td>00:15:00</td>
            <td>5 Jan</td>
            <td>1</td>
          </tr>
          <tr>
            <td>OSSUPPORT-1928</td>
            <td>This is a description</td>
            <td>00:15:00</td>
            <td>5 Jan</td>
            <td>1</td>
          </tr>
          </tbody>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'timers',
    data () {
      return {
        togglEntriesData: null
      }
    }
  }
</script>
