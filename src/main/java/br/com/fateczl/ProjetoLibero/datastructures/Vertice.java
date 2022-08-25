package br.com.fateczl.ProjetoLibero.datastructures;

public class Vertice {
	private String rotulo;
	private int grau;

	public Vertice(String rotulo) throws Exception {
		boolean isRotuloNullOrBlank = rotulo == null || rotulo != null && "".equals(rotulo.trim());
		if (isRotuloNullOrBlank) {
			throw new Exception("Nao e permitida a inclusão de vertices sem rotulo.");
		}
		this.rotulo = rotulo;
	}

	public String getRotulo() {
		return this.rotulo;
	}

	void addGrau() {
		grau++;
	}

	public int getGrau() {
		return grau;
	}
}
