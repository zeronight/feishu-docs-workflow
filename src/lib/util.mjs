export const formatTime = ts => new Date(ts * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '');

export const removeHtmlTag = s => s.replace(/<\w+>([^<]+)<\/\w+>/g, '$1');