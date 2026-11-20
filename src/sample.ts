export const sample = JSON.stringify({
  station: 'Harbour Point',
  id: 'HP-0417',
  active: true,
  installed: '2019-04-12',
  location: { lat: 50.3755, lon: -4.1427, 'elevation m': 12 },
  sensors: ['temperature', 'humidity', 'wind', 'rain'],
  readings: [
    { time: '2026-11-20T09:00:00Z', temperature: 9.4, humidity: 81, wind: { speed: 6.2, bearing: 245 }, rain: 0 },
    { time: '2026-11-20T10:00:00Z', temperature: 10.1, humidity: 78, wind: { speed: 7.8, bearing: 250 }, rain: 0.2 },
    { time: '2026-11-20T11:00:00Z', temperature: 10.9, humidity: null, wind: { speed: 9.1, bearing: 262 }, rain: 1.4 },
  ],
  maintenance: { lastVisit: '2026-10-03', notes: 'Rain gauge cleared; anemometer bearing replaced.', due: false },
  tags: [],
})
