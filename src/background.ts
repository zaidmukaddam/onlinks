import { Message } from './types'

const url =
  process.env.NODE_ENV === 'production'
    ? 'https://link-roamer.zaidmukaddam.repl.co'
    : 'http://localhost:8080'

/**
 * Listens for a message from the extension to fetch HEAD information
 * about each given link to check if it returns a 404 or not.
 */
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.action === 'fetchLinks') {
      const init: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: message.data,
      }

      try {
        fetch(url, init)
          .then((result) => result.json())
          .then(sendResponse)
      } catch (error) {
        sendResponse([])
      }
    }

    return true
  }
)

/**
 * Sets the extension to disabled by default and makes it possible
 * to invoke only on http schemed pages.
 */
if ('isV3Manifest') {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable()

    const enableOnHttpPages = {
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { schemes: ['https', 'http'] },
        }),
      ],
      actions: [new chrome.declarativeContent.ShowAction()],
    }

    chrome.declarativeContent.onPageChanged.addRules([enableOnHttpPages])
  })
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: 'public/onboarding.html' })
  }
})
