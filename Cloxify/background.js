let activeDomain = null
let startTime = null
let domainTimes = {}

const SUPABASE_URL = "https://mayvkdzpwpujeprgghxr.supabase.co/rest/v1/rpc/add_time"
const SUPABASE_KEY = "sb_publishable_-flrhjd60ZQqyiWQv5FvaA_znP2uqj6"


function generateId() {
  return crypto.randomUUID()
}

async function getUserId() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["user_id"], (result) => {
      if (result.user_id) {
        resolve(result.user_id)
      } else {
        const newId = generateId()
        chrome.storage.local.set({ user_id: newId }, () => {
          console.log("Novo user_id gerado:", newId)
          resolve(newId)
        })
      }
    })
  })
}

async function sendToSupabase(domain, seconds) {
  const userId = await getUserId()

  try {
    const response = await fetch(SUPABASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_domain: domain,
        p_seconds: seconds,
        p_user_id: userId
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Erro Supabase:", errorText)
      return
    }

    console.log(`Tempo enviado: ${domain} +${seconds}s`)
  } catch (error) {
    console.error("Erro fetch:", error)
  }
}

async function flushBuffer() {

  const entries = Object.entries(domainTimes)

  if (entries.length === 0) return

  console.log("Enviando buffer:", domainTimes)

  for (const [domain, seconds] of entries) {

    if (seconds > 0) {
      await sendToSupabase(domain, seconds)
    }

  }

  domainTimes = {}
}

async function registerDevice() {

  const deviceId = await getUserId()

  try {

    await fetch("https://mayvkdzpwpujeprgghxr.supabase.co/rest/v1/rpc/register_device", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        p_device_uuid: deviceId
      })
    })

    console.log("Device registrado:", deviceId)

  } catch (error) {

    console.error("Erro registrando device:", error)

  }

}

setInterval(() => {
  if (!activeDomain || !startTime) return

  const now = Date.now()
  const timeSpent = now - startTime
  const seconds = Math.floor(timeSpent / 1000)

  if (seconds <= 0) return

  if (!domainTimes[activeDomain]) {
    domainTimes[activeDomain] = 0
  }

  domainTimes[activeDomain] += seconds

  startTime = now

  console.log(`Heartbeat +${seconds}s em ${activeDomain}`)

}, 10000)

chrome.tabs.onActivated.addListener((activeInfo) => {

  const now = Date.now()

  if (activeDomain && startTime) {

    const timeSpent = now - startTime
    const seconds = Math.floor(timeSpent / 1000)

    if (seconds > 0) {

      if (!domainTimes[activeDomain]) {
        domainTimes[activeDomain] = 0
      }

      domainTimes[activeDomain] += seconds

      console.log(
        `Domínio ${activeDomain} acumulou ${domainTimes[activeDomain]} segundos`
      )
    }
  }

  chrome.tabs.get(activeInfo.tabId, (tab) => {

    if (!tab.url || tab.url.startsWith("chrome://")) return

    const url = new URL(tab.url)

    activeDomain = url.hostname
    startTime = Date.now()

    console.log("Novo domínio ativo:", activeDomain)

  })

})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

  if (changeInfo.status !== "complete") return

  if (!tab.url || tab.url.startsWith("chrome://")) return

  const url = new URL(tab.url)
  const newDomain = url.hostname

  if (newDomain === activeDomain) return

  const now = Date.now()

  if (activeDomain && startTime) {

    const timeSpent = now - startTime
    const seconds = Math.floor(timeSpent / 1000)

    if (seconds > 0) {

      if (!domainTimes[activeDomain]) {
        domainTimes[activeDomain] = 0
      }

      domainTimes[activeDomain] += seconds

      console.log(`Mudança de URL - ${activeDomain} +${seconds}s`)

    }

  }

  activeDomain = newDomain
  startTime = now

  console.log("Novo domínio detectado:", activeDomain)

})

chrome.windows.onFocusChanged.addListener((windowId) => {

  if (windowId === chrome.windows.WINDOW_ID_NONE) {

    if (activeDomain && startTime) {

      const now = Date.now()
      const timeSpent = now - startTime
      const seconds = Math.floor(timeSpent / 1000)

      if (seconds > 0) {

        if (!domainTimes[activeDomain]) {
          domainTimes[activeDomain] = 0
        }

        domainTimes[activeDomain] += seconds

        console.log(`Janela perdeu foco - ${activeDomain} +${seconds}s`)
      }

      startTime = null
    }

  } else {

     if (activeDomain) {
    startTime = Date.now()
  }

  }

})

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

  const tab = tabs[0]

  if (!tab || !tab.url || tab.url.startsWith("chrome://")) return

  const url = new URL(tab.url)

  activeDomain = url.hostname
  startTime = Date.now()

  console.log("Domínio inicial:", activeDomain)

})

registerDevice()
setInterval(flushBuffer, 30000)