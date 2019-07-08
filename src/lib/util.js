exports.formatTime = ts => new Date(ts * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');

exports.removeHtmlTag = s => s.replace(/<\w+>([^<]+)<\/\w+>/g, '$1');