package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.*;

public class Grafo {
	private int qtdMaximaVertices;
	private boolean isQtdMaximaDefinida;
	private int qtdAtualVertices = 0;
	private Map<String, Integer> rotulosEmIndices = new HashMap<String, Integer>();
	
	private List<Vertice> vertices = new ArrayList<Vertice>();
	MatrizAdjacencia matrizAdjacencia = new MatrizAdjacencia(vertices);
	
	public Grafo() {
		qtdMaximaVertices = 10;
		
	}

	public Grafo(int qtdVertices) {
		if (qtdVertices <= 0) {
			throw new IllegalArgumentException("A quantidade max. deve ser >= 1");
		}
		qtdMaximaVertices = qtdVertices;
		isQtdMaximaDefinida = true;
	}

	public void adicionarVertice(String rotulo) throws Exception {
		if (qtdAtualVertices <= qtdMaximaVertices - 1) {
			Vertice novoVertice = new Vertice(rotulo);
			this.vertices.add(novoVertice);
			this.rotulosEmIndices.put(rotulo, qtdAtualVertices);
			qtdAtualVertices++;
		} else {
			throw new Exception("A quantidade de vertices permitida (" + qtdMaximaVertices + ") foi excedida.");
		}
	}

	public List<Vertice> getVertices() {
		return this.vertices;
	}

	public Vertice getVertice(String rotulo) {
		this.existeVerticeOrThrow(rotulo);
		int indice = this.rotulosEmIndices.get(rotulo);
		return this.vertices.get(indice);
	}

	public void conectarVertices(String rotuloVerticeInicial, String rotuloVerticeFinal) throws Exception {
		if (!this.existeVertice(rotuloVerticeInicial) || !this.existeVertice(rotuloVerticeFinal)) {
			throw new Exception("Para adicionar uma aresta ambos os vértices devem existir.");
		}
		criarMatrizAdjacencia();
		int indiceVerticeFinal = this.rotulosEmIndices.get(rotuloVerticeInicial);
		int indiceVerticeInicial = this.rotulosEmIndices.get(rotuloVerticeFinal);
		this.matrizAdjacencia.adicionarAresta(indiceVerticeInicial, indiceVerticeFinal);
	}

	public List<Vertice> getAdjacencias(String vertice) {
		this.existeVerticeOrThrow(vertice);
		int indiceVertice = this.rotulosEmIndices.get(vertice);
		return this.matrizAdjacencia.getAdjacencias(indiceVertice);
	}

	private boolean existeVerticeOrThrow(String vertice) {
		if (!existeVertice(vertice)) {
			throw new IllegalArgumentException("O vértice não existe.");
		}
		return true;
	}

	private boolean existeVertice(String rotuloVertice) {
		int indice = this.rotulosEmIndices.get(rotuloVertice);
		return this.vertices.get(indice) != null ? true : false;
	}
	
	private void criarMatrizAdjacencia() {
		if(this.matrizAdjacencia == null){
			this.matrizAdjacencia = new MatrizAdjacencia(new
			ArrayList<Vertice>(this.vertices));
			}
	}
}
