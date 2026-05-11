use vercel_runtime::{run, Error, ServiceBuilder};
use solupi_backend::create_app;

#[tokio::main]
async fn main() -> Result<(), Error> {
    let app = create_app().await;
    run(ServiceBuilder::new().service(app)).await
}
