package br.com.fateczl.ProjetoLibero.datastructures;

import java.util.List;

import org.olap4j.Position;
import org.olap4j.metadata.Member;

public class DNode<E> implements Position {
	
	private DNode<E> prev, next;
	private E element;
	
	public DNode(DNode<E> newPrev, DNode <E> newNext, E elem) {
		prev = newPrev;
		next = newNext;
		element = elem;
	}
	
	public E element() {
		if ((prev == null) && (next == null)) {
			//erro
		}
		return element;
	}
	
	public DNode<E> getNext() { return next; }
	public DNode<E> getPrev() { return prev; }
	
	public void setNext(DNode<E> newNext ) { next = newNext; }
	public void setPrev(DNode<E> newPrev ) { prev = newPrev; }
	public void setElement( E newElement) { element = newElement; }

	@Override
	public List<Member> getMembers() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getOrdinal() {
		// TODO Auto-generated method stub
		return 0;
	}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static void main(String[] args) {
	String s = "Nó A";
	String t = "Nó B";
	String u = "Nó C";
		
		
	
	DNode n = new DNode(null, null, s);	
	DNode o = new DNode(null, null, t);
	DNode p = new DNode(null, null, u);
	
	n.setNext(o);
	o.setNext(p);
	p.setNext(n);
	
	NodePositionList<DNode> lista = new NodePositionList<DNode>();
	
	lista.addFirst(n);
		
	System.out.println(lista.isEmpty());
	}  

}
