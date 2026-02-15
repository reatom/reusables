import { urlAtom } from '@reatom/core'

import { hashToUrl, pathToHash, setupHashUrl } from './setup-hash-url'

// Call once at app initialization.
// All routing now uses hash-based URLs: #/path instead of /path.
setupHashUrl()

// Navigate — writes #/users/123 to the address bar
urlAtom.go('/users/123')

// Read current URL from hash
console.log(urlAtom().pathname) // '/users/123'

// Helpers are available for custom use
console.log(hashToUrl()) // URL { pathname: '/users/123', ... }
console.log(pathToHash('/about')) // '#/about'
