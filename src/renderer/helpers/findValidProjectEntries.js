/**
 * Finds valid Jira projects for a set of Toggl time entries.
 *
 * @param {Object[]} entries
 *   The time entries as they are returned by the Toggl API.
 * @param {String[]} ignoredProjectKeys
 *   An array of Jira project keys that should be ignored when logging.
 * @param {string} loggedTag
 *   The tag to use for Toggl entries that have been logged.
 * @param {string} ignoreTag
 *   The tag to use for Toggl entries that have been ignored.
 * @return {Object[][]}
 *   An array of arrays with the first item being the tagged entries and the
 *   second array being the untagged entries.
 */
export default function findValidProjectEntries (entries, ignoredProjectKeys, loggedTag, ignoreTag) {
  let tagged = []
  let untagged = []

  // Go through the data.
  for (const id in entries) {
    // Store each timer.
    let entry = entries[id]
    // Skip running timers.
    if (entry['duration'] < 0) {
      continue
    }
    // Check for a match on the ticket.
    let match = entry.description.match('([A-Z]{1,}-[0-9]{1,})')
    // New iteration.
    if (match && (ignoredProjectKeys === '' || match[0].indexOf(ignoredProjectKeys) === -1)) {
      if (entry.hasOwnProperty('tags') && Object.values(entry.tags).includes(loggedTag)) {
        tagged.push(entry)
      } else {
        // Add ticket number we matched.
        entry['ticket'] = match[0]
        entry['originalDescription'] = entry['description']
        // Manipulate the description.
        let desc = entry['description'].replace(match[0], '')
        desc = desc.replace(/- /, '')
        entry['description'] = desc
        untagged.push(entry)
      }
      // If we can't match the ticket, check if it should be ignored.
    } else if (!match) {
      if (entry.hasOwnProperty('tags') && Object.values(entry.tags).includes(ignoreTag)) {
        tagged.push(entry)
        // No match? Don't ignore? Then it's an UFO ticket.
      } else {
        // No ticket number found.
        entry['ticket'] = 'Unknown Ticket!'
        entry['description'] = entry['description']
        untagged.push(entry)
      }
    }
  }

  return [tagged, untagged]
}
