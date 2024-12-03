function generateCSV(visits) {
  const headers = [
    'Page',
    'Visitor IP',
    'User Agent',
    'Referrer',
    'Duration',
    'Start Time',
    'End Time',
    'Bounced'
  ].join(',');

  const rows = visits.map(visit => [
    visit.page,
    visit.visitor.ip,
    visit.visitor.userAgent,
    visit.visitor.referrer,
    visit.duration,
    visit.startTime,
    visit.endTime,
    visit.bounced
  ].join(','));

  return [headers, ...rows].join('\n');
}

module.exports = generateCSV; 