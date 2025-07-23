package main

import (
	"fmt"
	"net/http"
)

func main() {
	// Serve JS files
	// jsfs := http.FileServer(http.Dir("./js"))
	// http.Handle("/js/", http.StripPrefix("/js/", jsfs))
	jsfs := http.FileServer(http.Dir("./js"))
	http.Handle("/frontend/js/", http.StripPrefix("/frontend/js/", jsfs))
	// Serve CSS files
	cssfs := http.FileServer(http.Dir("./statics/css"))
	http.Handle("/statics/css/", http.StripPrefix("/statics/css/", cssfs))
	// Serve static HTML pages
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/home.html")
	})
	// http.HandleFunc("/home", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "statics/home.html")
	// })
	http.HandleFunc("/signUp", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/signUp.html")
	})
	http.HandleFunc("/loginPage", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/login.html")
	})
	http.HandleFunc("/adminPanel", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/adminPanel.html")
	})
	http.HandleFunc("/daneshjo", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/daneshjo.html")
	})
	http.HandleFunc("/professor", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/professor.html")
	})
	http.HandleFunc("/permission", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/permission.html")
	})
	http.HandleFunc("/unauthorized", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/unauthorized.html")
	})
	http.HandleFunc("/forbidden", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "statics/forbidden.html")
	})
	// Start server
	err := http.ListenAndServe(":8082", nil)
	if err != nil {
		fmt.Printf("reading error: %v", err)
	}
}
