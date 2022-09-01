package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.*;

public class MatrizAdjacencia {
	private int[][] matriz;
	private List<vertex> vertices;
	private int qtdVertices;

	public MatrizAdjacencia(int [][] matriz, List<vertex> vertices,int qtdVertices) {
		this.matriz = matriz;
		this.vertices = vertices;
		this.qtdVertices = qtdVertices;
	}
	public MatrizAdjacencia(List<vertex> vertices) {
		this.vertices = vertices;
		this.qtdVertices = vertices.size();
		matriz = new int[qtdVertices][qtdVertices];
		inicializarMatriz();
	}
	
	private void inicializarMatriz() {
		for (int i = 0; i < matriz.length; i++) {
			for (int j = 0; j < matriz[i].length; j++) {
				matriz[i][j] = 0;
			}
		}
	}

	public void adicionarAresta(int indiceVerticeInicial, int indiceVerticeFinal) {
		vertex verticeInicial = vertices.get(indiceVerticeInicial);
		vertex verticeFinal = vertices.get(indiceVerticeFinal);
		if (indiceVerticeInicial == indiceVerticeFinal) {
			matriz[indiceVerticeInicial][indiceVerticeInicial] = 1;
			verticeInicial.addGrau();
		} else {
			matriz[indiceVerticeInicial][indiceVerticeFinal] = 1;
			verticeInicial.addGrau();

			matriz[indiceVerticeFinal][indiceVerticeInicial] = 1;
			verticeFinal.addGrau();
		}
	}

	public List<vertex> getAdjacencias(int indiceVertice) {
		int linha = indiceVertice;
		List<vertex> adjacencias = new ArrayList<>();
		for (int j = 0; j < vertices.size(); j++) {
			if (matriz[linha][j] == 1) {
				vertex vertice = vertices.get(j);
				adjacencias.add(vertice);
			}
		}
		return adjacencias;
	}
}
