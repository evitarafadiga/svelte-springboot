package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.Scanner;

public class buscap {
	
	public static class vertice {
		int num;
		vertice prox;
	}
	
	public static class listaadj{
		public vertice listav;
	}
	
	public static class queue {
		int numv;
		queue prox;
	}
	
	public static void empilhar(int n) {
		queue novo = new queue();
		novo.numv = n;
		novo.prox = pilha;
		pilha = novo;
	}
	
	public static void desempilhar(int v) {
		if(pilha.numv == v) {
			pilha = pilha.prox;
		}
	}
	static queue pilha = null;
	static Scanner entrada = new Scanner(System.in);
	static int marcado[];
	
	static listaadj Adj[];
	
	// public static void main(String args[]) {
	// 	vertice novo;
		
	// 	int tam, org, dest, op, num, tipo;
	// 	String menu;
		
	// 	System.out.println("\n Tipo do grafo (1 - não orientado, 2 - orientado:");
	// 	tipo = entrada.nextInt();
		
	// 	System.out.println("\n Digite o numero de vertices do grafo:");
	// 	tam = entrada.nextInt();
	// 	//alocacao de memoria
	// 	Adj = new listaadj[tam+1];
	// 	marcado = new int [tam+1];
	// 	//inicializacao de variaveis
	// 	for(int i = 1; i <= tam; i++) {
	// 		Adj[i]= new listaadj();
	// 		marcado[i] = 0;
	// 	}
		
	// 	System.out.println("\n Arestas do grafo: VerticeOrigem (-1 para parar):");
	// 	org = entrada.nextInt();
		
	// 	System.out.println("\n Arestas do grafo: VerticeDestino(-1 para parar):");
	// 	dest= entrada.nextInt();
		
	// 	while(org != -1 && dest != -1) {
	// 		novo = new vertice();
	// 		novo.num = dest;
	// 		novo.prox = Adj[org].listav;
	// 		Adj[org].listav = novo;
			
	// 		if(tipo==1) {
	// 			novo = new vertice();
	// 			novo.num = org;
	// 			novo.prox = Adj[dest].listav;
	// 			Adj[dest].listav = novo;
	// 		}
	// 		System.out.println("\n Arestas do grafo: VerticeOrigem(-1 para parar):");
	// 		org = entrada.nextInt();
	// 		System.out.println("\n Arestas do grafo: VerticeDestino(-1 para parar):");
	// 		dest = entrada.nextInt();
	// 	} do {
	// 		menu = 	"\n1-Busca em profundidade"+
	// 				"\n2-Mostrar lista de adjacencias"+
	// 				"\n4-Sair"+
	// 				"\nDigite sua opcao: ";
	// 		System.out.println(menu);
	// 		op = entrada.nextInt();
			
	// 		switch(op) {
	// 			case 1: System.out.println("Digite um vertice de partida da busca: ");
	// 					num = entrada.nextInt();
	// 					System.out.println(" "+ num);
	// 					buscaprof(Adj, tam, num);
	// 					for(int i = 1; i<= tam; i++) marcado[i] = 0;
	// 					break;
	// 			case 2: mostrar_Adj(Adj, tam);
	// 					break;
	// 		}
	// 	} while (op!=4);
		
	// }
	static void buscaprof(listaadj Adj[], int tam, int v) {
		vertice vert;
		int w;
		
		marcado[v] = 1;
		empilhar(v);
		for(int i = 1; i <= tam; i++) {
			vert = Adj[v].listav;
			while(vert != null) {
				w = vert.num;
				if(marcado[w] != 1) {
					System.out.println(" "+w);
					buscaprof(Adj, tam, w);
				}
				vert = vert.prox;
			}
		}
		desempilhar(v);
	}
	static void mostrar_Adj(listaadj Adj[], int tam) {
		vertice v;
		for (int i = 1; i < tam; i++) {
			v = Adj[i].listav;
			System.out.println("Entrada "+i+" ");
			while(v != null) {
				System.out.println("("+i+","+v.num+") "+" ");
				v=v.prox;
			}
		}
	}
}
