package br.com.fateczl.ProjetoLibero.persistence;

import java.sql.SQLException;
import java.util.List;

import br.com.fateczl.ProjetoLibero.model.Carreiras;

public interface ICarreirasDao {

	String insertCarreiras(Carreiras car) throws SQLException;

	String updateCarreiras(Carreiras car) throws SQLException;

	String deleteCarreiras(Carreiras car) throws SQLException;

	List<Carreiras> listaCarreiras() throws SQLException, ClassNotFoundException;

}
