package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.Scanner;

import br.com.fateczl.ProjetoLibero.datastructures.CaminhoMinimo.listaadj;
import br.com.fateczl.ProjetoLibero.datastructures.CaminhoMinimo.vertice;

@SuppressWarnings("unused")
public class CaminhoMinimo 
{
		
		public static class vertice 
		{
			int num;
			int peso;
			vertice prox;
		}
		
		public static class listaadj 
		{
			public vertice listav;
			
		}
		
		static ListaPrior lista;
		static Scanner entrada = new Scanner(System.in);
		static int marcado[];
		static int pai[];
		static int dist[];
		static listaadj Adj[];
	
	public static void main(String args[]) 
	{
		vertice novo;
		
		int tam,
		org,
		dest,
		op,
		num=0,
		flag=0,
		peso=0;
		String menu;
		
		System.out.println("\n Digite o numero de vertices do grafo orientado:");
		tam = entrada.nextInt();
		Adj = new listaadj[tam+1];
		marcado = new int [tam+1];
		pai = new int[tam+1];
		dist = new int [tam+1];
		
		for(int i = 1; i <= tam; i++) 
		{
			Adj[i]= new listaadj();
			marcado[i] = 0;
		}
		
		System.out.println("\n Arestas do grafo: VerticeOrigem (-1 para parar):");
		org=entrada.nextInt();
		
		System.out.println("\n Arestas do grafo: VerticeDestino(-1 para parar):");
		dest= entrada.nextInt();
		
		while(org != -1 && dest != -1) 
		{
			System.out.println("\n Peso da aresta:");
			peso = entrada.nextInt();
			novo = new vertice();
			novo.num = dest;
			novo.peso = peso;
			
			novo.prox = Adj[org].listav;
			Adj[org].listav = novo;
			
			System.out.println("\n Arestas do grafo: VerticeOrigem(-1 para parar):");
			org = entrada.nextInt();
			System.out.println("\n Arestas do grafo: VerticeDestino(-1 para parar):");
			dest = entrada.nextInt();
		}
		do 
		{
			menu = "\n1-Caminho Minimo"+
					"\n2-Mostrar lista de adjacencias"+
					"\n3-Mostrar distancias"+
					"\n4-Sair"+
					"\nDigite sua opcao: ";
			System.out.println(menu);
			op = entrada.nextInt();
			switch(op) 
			{
			case 1: System.out.println("Digite um vertice de origem: ");
					num = entrada.nextInt();
					
					for(int i = 1; i <= tam; i++) 
					{
						marcado[i] = 0;
						dist[i] = 0;
					}
					dijkstra(Adj, tam, num);
					flag=1;
					break;
			case 2: mostrar_Adj(Adj, tam);
					break;
			case 3:
					if(flag==0) System.out.println("Necessario realizar a busca primeiro");
						else mostrar_dist(tam, num);
					break;
					
			}
		} while (op != 4);
	}
	
	@SuppressWarnings("static-access")
	static void dijkstra(listaadj Adj[], int tam, int v) 
	{
		int i, w;
		int C[] = new int[tam];
		int tamC = 0;
		lista = new ListaPrior(tam);
		
		dist[v]=0;
		lista.inserir(v, dist);
		for(i=1; i<=tam; i++) 
		{
			if (i!=v) 
			{
				dist[i]=Integer.MAX_VALUE;
				pai[i]=0;
				lista.inserir(i, dist);
			}
		}
		while(lista.tam != 0) 
		{
			w = lista.remover(dist);
			C[tamC] = w;
			tamC++;
			
			vertice x = Adj[w].listav;
			while(x!=null) {
				relax(w, x.num, x.peso);
				x=x.prox;
			}
			lista.constroiheap(dist);
		}
	}
	
	static void relax(int u, int v, int peso) 
	{
		if(dist[v] > dist[u]+peso) 
		{
			dist[v] = dist[u] + peso;
			pai[v] = u;
		}
	}
	
	static void mostrar_Adj(listaadj Adj[], int tam) 
	{
		vertice v;
		for(int i=1; i<= tam; i++) 
		{
			v = Adj[i].listav;
			System.out.println("Entrada "+i+" ");
			while(v != null) 
			{
				System.out.println("("+i+","+v.num+")"+"");
				v=v.prox;
			}
		}
	}

	static void mostrar_dist(int tam, int or) 
	{
		System.out.println("Distancia da origem "+or+" para os demais vertices\n");
		for(int i=1; i <= tam; i++) 
		{
			System.out.println(""+i+"-"+dist[i]);
		}
	}
}