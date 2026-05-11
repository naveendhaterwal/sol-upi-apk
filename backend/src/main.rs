use solupi_backend::create_app;
use std::env;
use dotenvy::dotenv;

#[tokio::main]
async fn main() {
    dotenv().ok();
    
    let app = create_app().await;

    let port = env::var("PORT").unwrap_or_else(|_| "3001".to_string());
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .expect("Failed to bind to port");

    println!("✅ SolUPI Backend running on port {}", port);
    axum::serve(listener, app).await.unwrap();
}
