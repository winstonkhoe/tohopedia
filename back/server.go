package main

import (
	"log"
	"net/http"
	"os"

	"tohopedia/config"
	"tohopedia/directives"
	"tohopedia/graph"
	"tohopedia/graph/generated"
	"tohopedia/middlewares"
	"tohopedia/migration"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/joho/godotenv"

	// "github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

// const defaultPort = "50"
const defaultPort = "8080"

func main() {

	// Database Migration
	migration.MigrateTable()

	godotenv.Load()

	port := os.Getenv("PORT")
	// port := process.env.PORT || 80
	if port == "" {
		port = defaultPort
	}

	// log.Printf("PORT: %s",port)

	db:= config.GetDB()
	sqlDB, _ := db.DB()
	defer sqlDB.Close()
	
	router := chi.NewRouter()
	router.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
        AllowOriginFunc:  func(origin string) bool { return true },
        AllowedMethods:   []string{},
        AllowedHeaders:   []string{"*"},
        AllowCredentials: true,
        Debug:            true,
	}).Handler)
		
	router.Use(middlewares.AuthMiddleware)

	c := generated.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))
	srv.AddTransport(&transport.Websocket{
        Upgrader: websocket.Upgrader{
            CheckOrigin: func(r *http.Request) bool {
                // Check against your desired domains here
                return r.Host == "0.0.0.0:"+port
                // return r.Host == "https://tohopedia-app.herokuapp.com:8080"
                // return r.Host == "https://tohopedia-app.herokuapp.com:"+port
                // return r.Host == "localhost:8080"
            },
            ReadBufferSize:  1024,
            WriteBufferSize: 1024,
        },
    })
	// srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)
	// http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	// http.Handle("/query", srv)

	log.Printf("connect to https://tohopedia-app.herokuapp.com:%s/ for GraphQL playground", port)
	// log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	// log.Fatal(http.ListenAndServe(":"+port, router))
	err := http.ListenAndServe(":"+port, router)
	// err := http.ListenAndServe(":"+port, router)
	if err != nil {
        panic(err)
    }
	// log.Fatal(http.ListenAndServe(":"+port, nil))
}
