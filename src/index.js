const app = require("./server");
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on("SIGINT", function onSigint() {
    console.info(
        "SIGINT (ctrl-c in docker). Graceful shutdown",
        new Date().toISOString()
    );
    shutdown();
});

process.on("SIGTERM", function onSigterm() {
    console.info(
        "SIGTERM (docker container stop). Graceful shutdown",
        new Date().toISOString()
    );
    shutdown();
});

function shutdown() {
    server.close(function onServerClosed(err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        process.exit(0);
    });
}