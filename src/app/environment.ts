export const environment = {
    apiUrl: (() => {
        const frontendUrl = window.location.href;

        if (frontendUrl.includes('dev')) {
            return 'https://libroteka-app.onrender.com';
        } else if (frontendUrl.includes('prod')) {
            return 'https://libroback.koyeb.app';
        } else {
            return 'http://localhost:8000';
        }
    })()
};
