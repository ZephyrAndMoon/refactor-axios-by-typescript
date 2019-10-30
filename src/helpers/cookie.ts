const cookie = {
  read(name: string): string | null {
    // (^|;\\s*) 为 开头 或者 '; '
    // ([^;]*)') 为 = 与 ;中间的cookie值
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'))
    return match ? decodeURIComponent(match[3]) : null
  }
}

export default cookie
