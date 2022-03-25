package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"tohopedia/config"
	"tohopedia/directives"
	"tohopedia/graph"
	"tohopedia/graph/generated"
	"tohopedia/handlers"
	"tohopedia/middlewares"
	// "tohopedia/migration"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	// "github.com/joho/godotenv"

	// "github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
)

type Message struct {
	Message string `json:"message"`
}

// const defaultPort = "50"
const defaultPort = "8080"

func main() {
	log.Println("BACKEND STARTING")
	// Database Migration
	// migration.MigrateTable()

	// godotenv.Load()

	port := os.Getenv("PORT")
    if port == "" {
        port = defaultPort
    }

	// hub := NewHub()
	// go hub.run()

	log.Printf("PORT: [%s]\n",port)
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

	// c := generated.Config{Resolvers: &graph.Resolver{}}
	// c.Directives.Auth = directives.Auth

	
	// srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))

	// START EXPERIMENT

	log.Println("Loading Routes...")

	hub := handlers.NewHub()
	go hub.Run()

	// port := process.env.PORT || 80
	// if port == "" {
	// 	port = defaultPort
	// }

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
	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
		w.Header().Set("Content-Type", "application/json")
		resp := make(map[string]string)
		resp["message"] = "Ping Success"
		jsonResp, err := json.Marshal(resp)
		if err != nil {
			log.Fatalf("Error happened in JSON marshal. Err: %s", err)
		}
		w.Write(jsonResp)
	})
	router.Handle("/query", srv)


	router.HandleFunc("/ws/{username}", func(responseWriter http.ResponseWriter, request *http.Request) {
		var upgrader = websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
                return true
            },
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
		}

		// Reading username from request parameter
		// username := route.Get(chi.URLParam(request, "username"), route.NotFoundHandler())

		// Upgrading the HTTP connection socket connection
		connection, err := upgrader.Upgrade(responseWriter, request, nil)
		if err != nil {
			log.Println(err)
			return
		}

		username := chi.URLParam(request, "username")

		fmt.Println("Username WebSocket")
		fmt.Println(username)

		handlers.CreateNewSocketUser(hub, connection, username)

	})

	log.Println("Routes are Loaded.")

	// END EXPERIMENT

	// srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))
	// srv.AddTransport(&transport.Websocket{
    //     Upgrader: websocket.Upgrader{
    //         CheckOrigin: func(r *http.Request) bool {
    //             // Check against your desired domains here
    //             return r.Host == "0.0.0.0:"+port
    //             // return r.Host == "https://tohopedia-app.herokuapp.com:8080"
    //             // return r.Host == "https://tohopedia-app.herokuapp.com:"+port
    //             // return r.Host == "localhost:8080"
    //         },
    //         ReadBufferSize:  1024,
    //         WriteBufferSize: 1024,
    //     },
    // })
	// router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	// router.Handle("/query", srv)
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
