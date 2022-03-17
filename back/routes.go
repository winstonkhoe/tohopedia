package main

import (
	"log"
	"net/http"
	"os"

	"tohopedia/directives"
	"tohopedia/graph"
	"tohopedia/graph/generated"
	handlers "tohopedia/handlers"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
)

// AddApproutes will add the routes for the application
func AddApproutes(route *chi.Mux) {

	log.Println("Loading Routes...")

	hub := handlers.NewHub()
	go hub.Run()

	port := os.Getenv("PORT")
	// port := process.env.PORT || 80
	if port == "" {
		port = defaultPort
	}

	c := generated.Config{Resolvers: &graph.Resolver{}}
	c.Directives.Auth = directives.Auth
	
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))
	srv.AddTransport(&transport.Websocket{
        Upgrader: websocket.Upgrader{
            CheckOrigin: func(r *http.Request) bool {
                // Check against your desired domains here
                // return r.Host == "0.0.0.0:"+port
                // return r.Host == "https://tohopedia-app.herokuapp.com:8080"
                // return r.Host == "https://tohopedia-app.herokuapp.com:"+port
                return r.Host == "localhost:8080"
            },
            ReadBufferSize:  1024,
            WriteBufferSize: 1024,
        },
    })
	route.Handle("/", playground.Handler("GraphQL playground", "/query"))
	route.Handle("/query", srv)


	route.HandleFunc("/ws/{username}", func(responseWriter http.ResponseWriter, request *http.Request) {
		var upgrader = websocket.Upgrader{
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

		
		handlers.CreateNewSocketUser(hub, connection, username)

	})

	log.Println("Routes are Loaded.")
}