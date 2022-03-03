package br.com.fateczl.ProjetoLibero.model;

public class Detalhes {
	
	private Assunto assunto;
	private PalavraChave palavrachave;
	private Roadmap roadmap;
	private Midia midia;
	
	public Assunto getAssunto() {
		return assunto;
	}
	public void setAssunto(Assunto assunto) {
		this.assunto = assunto;
	}
	public PalavraChave getPalavrachave() {
		return palavrachave;
	}
	public void setPalavrachave(PalavraChave palavrachave) {
		this.palavrachave = palavrachave;
	}
	public Roadmap getRoadmap() {
		return roadmap;
	}
	public void setRoadmap(Roadmap roadmap) {
		this.roadmap = roadmap;
	}
	public Midia getMidia() {
		return midia;
	}
	public void setMidia(Midia midia) {
		this.midia = midia;
	}
	
}
