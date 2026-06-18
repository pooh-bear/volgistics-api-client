# Volgistics API Client

[![npm version](https://badge.fury.io/js/volgistics-api-client.svg)](https://badge.fury.io/js/volgistics-api-client)

This is a client for the Volgistics API, built in TypeScript. 
It is designed to be used with a organization within the [Volgistics](https://www.volgistics.com/) volunteer platform.

## Installation

```bash
yarn add volgistics-api-client
```

## Usage

### Initialize

> **Note:** The `apiKey` parameter is required. See [Finding your API Key](#finding-your-api-key) below.

#### ESM
```ts
import { VolgisticsClient } from 'volgistics-api-client';

const client = new VolgisticsClient({ orgId: '1234', apiKey: 'your-api-key' });

client.login({ email: 'example@example.com', password: 'blah1234' });
```

#### CommonJS
```ts
const { VolgisticsClient } = require('volgistics-api-client');

const client = new VolgisticsClient({ orgId: '1234', apiKey: 'your-api-key' });

client.login({ email: 'example@example.com', password: 'blah1234' });
```

### Available methods

#### Finding your API Key

The Volgistics API requires an `X-API-Key` header. To find yours:

1. Log in to your Volgistics organization (e.g., `https://www.volgistics.com/vicnet/7607/schedule`)
2. Open your browser's Developer Tools (`F12` or `Cmd+Option+I`)
3. Go to the **Network** tab and filter by `schedule`
4. Reload the page or navigate to the schedule view
5. Click on any `schedule` XHR request
6. In the **Request Headers** section, find the `X-API-Key` value
7. Pass this value as the `apiKey` option when initializing the client

### Available methods

#### Get schedule
Retrieves schedule entries for a given date. Optionally filter entries by title prefix.
```ts
const schedule = await client.getSchedule({
  date: '2025-01-01',
  // prefix: 'Volunteer Services'
});
```

#### Add schedule entry
Signs you (or another volunteer) up for an open shift slot.

```ts
const schedule = await client.getSchedule({ date: '2025-01-01' });
const opening = schedule.find(e => e.meta.type === 'openings');

if (opening) {
  const result = await client.addScheduleEntry({
    jobNum: opening.meta.jobNum,
    slotNum: opening.meta.slotNum,
    from: opening.start,
    to: opening.end,
    slotNumbers: [opening.meta.slotNum],
  });

  if (result.vError.number === 0) {
    console.log('Scheduled!', result.vError.description);
    // result.schedule contains the updated schedule with the new entry
  }
}
```

#### Delete schedule entry
Removes a volunteer from a scheduled shift.

```ts
// Find your scheduled entry (meta.type === 'scheduled')
const myShift = schedule.find(e => e.meta.type === 'scheduled');

if (myShift) {
  const result = await client.deleteScheduleEntry({
    date: myShift.start,
    fillNumbers: [myShift.meta.fillNum],
  });

  if (result.vError.number === 0) {
    console.log('Removed!', result.vError.description);
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request and request a review from @pooh-bear.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
GitHub [@pooh-bear](https://github.com/pooh-bear)

## Disclaimer
This API client is a user-maintained project and is in no way affiliated with Volgistics. 
Usage of this client is subject to Volgistics' [Terms of Use](https://www.volgistics.com/terms.htm). 
No warranties are implied or given. Use at your own risk.