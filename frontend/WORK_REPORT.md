# Booking System Frontend Work Report

**Report date:** 2026-09-12
**Project:** Booking System Frontend
**Technology:** React 19, Vite, Axios, Oxlint

## 1. Project Structure

The project is organized as a Vite React application inside the `frontend/` directory.

- `src/main.jsx` is the application entry point.
- `src/App.jsx` is the main application component.
- `src/components/LoginForm/` contains the login UI and styles.
- `src/components/Register Form/` contains the registration component.
- `src/api/axios.jsx` contains the shared Axios client.
- `src/assets/` contains application images and template assets.
- `public/` contains public files such as the favicon.
- `vite.config.js` configures the Vite React plugin.
- `package.json` contains development, build, lint, and preview scripts.

## 2. Completed Work

### Application Setup

- React and React DOM are configured.
- Vite is configured for development and production builds.
- Strict Mode is enabled in `main.jsx`.
- Axios is installed and configured for backend communication.
- Oxlint is available for code-quality checks.

### Login Feature

The login form currently provides:

- Username input.
- Password input.
- Controlled React state for both fields.
- Form submission handling.
- `POST /login` API integration.
- Error state handling and visible error feedback.
- Responsive split-screen layout.
- Promotional room image and booking-focused messaging.
- Mobile and tablet responsive breakpoints.
- Input focus styling and button hover styling.

### Registration Feature

The registration component currently provides:

- Username input.
- Email input.
- Password input.
- Confirm password input.
- Controlled React state for all fields.
- Form submission handling.
- `POST /register` API integration.
- Error state management.

## 3. Visual and UX Quality

The login page has a clear two-column presentation:

- The image panel communicates the booking and accommodation purpose.
- The form panel keeps authentication actions focused.
- The layout adapts to smaller screens by stacking the image and form vertically.
- Form controls have consistent sizing and spacing.
- Error feedback is visually separated from the form.

The current design is functional and readable, but the default Vite styles in `index.css` still contain template-level theme and layout rules. These should be replaced or simplified so they do not conflict with the custom authentication page.

## 4. Quality Verification

### Production Build

The frontend production build passed from the `frontend/` directory:

```text
npm run build
vite v8.2.2 building client environment for production
76 modules transformed
built successfully
```

### Lint

Lint completed successfully with two warnings:

1. The `react` import in `src/components/LoginForm/loginform.jsx` is unused.
2. The `error` state in `src/components/Register Form/registerForm.jsx` is assigned but not rendered.

### Editor Diagnostics

No blocking editor diagnostics were reported for the main application files.

## 5. Known Issues and Risks

### Login Token Extraction

The login component currently destructures `token` directly from the Axios response. Most APIs return the token inside `response.data`, so the implementation should likely use:

```js
const { token } = response.data;
```

Until this is corrected and tested against the backend response, authentication persistence cannot be considered reliable.

### Registration Is Not Connected

`App.jsx` currently renders only `LoginForm`. `RegisterForm` is not reachable from the application UI.

A registration route, toggle, link, or page-level navigation flow is still required.

### Missing Registration Stylesheet

`registerForm.jsx` imports `./registerForm.css`, but no stylesheet with that name currently exists in the registration folder. This issue is hidden while the component is unused. Connecting the component will expose the missing import during the build.

### Registration Error Feedback

The registration component stores API errors but does not render the `error` value. Users will not receive visible feedback when registration fails.

### Environment Configuration

The Axios client uses a hardcoded backend URL:

```js
baseURL: "http://localhost:5000"
```

A Vite environment variable should be introduced before deployment so development, testing, staging, and production can use different backend URLs.

### Application Metadata

The document title is still `frontend`. It should be changed to a product-specific title such as `Booking System`.

### Test Coverage

No automated unit, integration, or end-to-end tests are currently present. Login and registration behavior should be tested against successful responses, failed responses, validation errors, and network failures.

## 6. Recommended Next Steps

1. Correct login token extraction to use the actual API response shape.
2. Add client-side validation for required fields and password confirmation.
3. Render registration errors and success feedback.
4. Add the missing registration stylesheet.
5. Connect registration to the application through routing or a login/register switch.
6. Replace default Vite styles in `index.css` with application-level global styles.
7. Move the backend URL to a Vite environment variable.
8. Update the document title and application metadata.
9. Add automated tests for authentication flows.
10. Run the production build and lint after the authentication flow is connected.

## 7. Overall Status

The project has a working React/Vite foundation and a visually implemented login experience. The production build is currently successful, and no blocking editor errors are present. The main remaining work is connecting registration, correcting the login response handling, completing validation and user feedback, and preparing configuration and tests for reliable use beyond local development.
