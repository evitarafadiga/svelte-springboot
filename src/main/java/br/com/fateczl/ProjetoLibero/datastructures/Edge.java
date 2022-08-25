package br.com.fateczl.ProjetoLibero.datastructures;

public class Edge {
	private int dest;
	private int source;
	private double weight;
	
	public Edge(int source, int dest) {
		this.source = source;
		this.dest = dest;
	}
	
	public Edge(int source, int dest, double w) {
		this.source = source;
		this.dest = dest;
		this.weight = w;
	}
	
	public boolean equals(Object o) {
		return false;
		
	}
	
	public int getDest() {
		return dest;
	}
	
	public int getSource() {
		return source;
	}
	
	public double getWeight() {
		return weight;
	}
	
	public int hashCode() {
		return dest;
		
	}
	
}
