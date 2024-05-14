import React, { useState, useEffect, useRef } from "react";
import { View, Text, Image, StyleSheet, ScrollView, StatusBar, FlatList, TouchableOpacity, Modal, SafeAreaView, TextInput, TouchableHighlight } from "react-native";
import { database } from "../../firebaseConfig"; 


interface Item {
  id: string;
  imagemUrl: string;
  descricao: string;
  preco: string;
  nome: string;
}

interface Categoria {
  id: string;
  nome: string;
  timestamp: number;
  itens: Item[];
}

interface categoriasData {
  nome: string;
  itens: Item[];
  timestamp: number;
}
export default function Home() {
  const [janelaendereco, setJanelaendereco] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [janelaItem, setJanelaItem] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);
  const [categoriaSelecionadaIndex, setCategoriaSelecionadaIndex] = useState<number>(0);
  const [verSacola, setVerSacola] = useState(false)
  const scrollRef = useRef<ScrollView>(null);

  
  const abrirEndereco = () => {
    setJanelaendereco(true);
  };
  
  const fecharEndereco = () => {
    setJanelaendereco(false);
  };

  //*função para abrir sacola
  const abrirSacola = () => {
    setVerSacola(true)
  }

  const fecharSacola = () => {
    setVerSacola(false)
  }
//*
  useEffect(() => {
    const ref = database().ref('categorias');

    ref.on('value', (snapshot: { val: () => { [key: string]: categoriasData; }; }) => {
      const categoriasData: { [key: string]: categoriasData } = snapshot.val();
      if (categoriasData) {
        const categoriasArray: Categoria[] = Object.entries(categoriasData).map(([id, { nome, itens, timestamp }]) => ({
          id,
          nome,
          timestamp,
          itens: itens ? Object.values(itens) : []
        }));
        setCategorias(categoriasArray.reverse());
      }
    });
    return () => ref.off();
  }, []);

  const abrirModal = (item: Item) => {
    setItemSelecionado(item);
    setJanelaItem(true);
  };

  const fecharModal = () => {
    setJanelaItem(false);
  };

  const scrollToCategory = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * 200, animated: true });
    }
    setCategoriaSelecionadaIndex(index);
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / 200); // Determina o índice da categoria com base na posição do scroll
    setCategoriaSelecionadaIndex(index); // Atualiza o estado para indicar a categoria selecionada
  };

  const renderCategoriaMenu = () => (
    <ScrollView horizontal style={styles.menu} onScroll={handleScroll}>
      {categorias.map((categoria, index) => (
        <TouchableOpacity 
          key={categoria.id} 
          onPress={() => scrollToCategory(index)}
          style={[styles.menuItem, categoriaSelecionadaIndex === index && styles.menuItemSelected]}
        >
          <Text style={[styles.menuItemText, categoriaSelecionadaIndex === index && styles.menuItemSelectedText]}>
            {categoria.nome}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderItem = ({ item }: { item: Item }) => (
    <TouchableOpacity onPress={() => abrirModal(item)}>
      <View>
        <Image source={{uri: item.imagemUrl}} style={styles.imagem}/>
        <Text style={styles.preco}>R${item.preco}</Text>
        <Text style={styles.nome}>{item.nome}</Text>
      </View>
    </TouchableOpacity>
  );

  

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#5a5555"
        barStyle="light-content"
      />
     <TouchableOpacity style={{width:'93%', height:'8%',alignSelf:'center',borderRadius:15}}onPress={abrirEndereco}>
        <View style={styles.location}>

         
            <View style={{marginStart:15}}>
              <Text style={{fontWeight:"bold",color:'#000000'}}>Entregar em, até 1h20m</Text>
              <Text style={{color:'#ff3f5b', fontSize:17, fontWeight:'bold'}}>Selecionar endereço</Text>
            </View>

          <Image source={require('./icons/location.png')}
          style={styles.locationimg}/>

      
        </View>
      </TouchableOpacity>

      <Modal
      visible={janelaendereco}
      onRequestClose={fecharEndereco}
      animationType="slide"
      transparent={true}>
        
        <ScrollView style={{backgroundColor:'#d9d9d9'}}>
            <Text style={{color:'#000', fontSize:25,marginLeft:20, marginTop:35, paddingBottom:60 }}>Informe seu endereço</Text>
            
          <View style={{alignItems:'center'}}>
            
            <View style={{backgroundColor:'#ffffff', width:'90%', height:50, borderRadius:15, flexDirection:'row'}}>
              
              <TextInput
              style={styles.inputtext}
              placeholder="INSIRA O CEP DO ENDEREÇO"
              ></TextInput>
            
              <TouchableOpacity style={{width:35, height:35, alignSelf:'center',}}>
              <Image
              source={require('./icons/procurar.png')}
              style={{height:35, width:35, }}/>
              </TouchableOpacity>
              
            </View>
            <View style={styles.listendereco}>
              <TextInput
              style={styles.inputtext}
              placeholder="BAIRRO:"></TextInput>
            </View>
            <View style={styles.listendereco}>
              <TextInput
              style={styles.inputtext}
              placeholder="ENDEREÇO:"></TextInput>

            </View>

            <View style={styles.listendereco}>
              <TextInput
              style={styles.inputtext}
              placeholder="NÚMERO:"></TextInput>

            </View>

            <View style={styles.listendereco}>
              <TextInput
              style={styles.inputtext}
              placeholder="COMPLEMENTO (OPCIONAL)"></TextInput>

            </View>

            <View style={styles.listendereco}>
              <TextInput
              style={styles.inputtext}
              placeholder="PONTO DE REFERÊNCIA (OPCIONAL)"></TextInput>

            </View>
            

            <TouchableOpacity style={{paddingTop:23}}>
            <View style={{backgroundColor:'#000', width:300, height:60, justifyContent:'center', borderRadius:15 }}>
              <Text style={{color:'#fff',alignSelf:'center'}}>SALVAR ENDEREÇO</Text>
              </View>
            </TouchableOpacity>

          </View>
          

        </ScrollView>
        
      </Modal>
    
      {renderCategoriaMenu()}

      <ScrollView style={styles.container} ref={scrollRef}>

      <Image source={require('./img/testek.png')} />
      
      
        {categorias.map((categoria, index) => (
          <View key={categoria.id}>
            <Text style={styles.textCategoria}>{categoria.nome}</Text>
            <View style={{ borderWidth: 0.3, backgroundColor: '#a6a6a6', width: '95%', alignSelf: 'center', marginTop: 10 }}></View>
            <FlatList
              style={styles.list}
              data={categoria.itens}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={janelaItem}
        onRequestClose={fecharModal}
        animationType="slide"
      >
        {itemSelecionado && (
          <ScrollView>
            <Image source={{uri: itemSelecionado.imagemUrl}} style={styles.modalImagem}/>
            <Text style={styles.modalNome}>{itemSelecionado.nome}</Text>
            <Text style={styles.modaldescricao}>{itemSelecionado.descricao}</Text>
            <Text style={styles.modalPreco}>R${itemSelecionado.preco}</Text>
          </ScrollView>
        )}
      </Modal>

      <View style={styles.sacola}>
        <View>
          <Text style={{marginLeft:15, marginTop:13, fontSize:15,}}>Total sem a entrega</Text>
          <Text style={{marginLeft:15, fontSize:22, fontWeight:'bold', color:'#000'}}>R$ 10,00</Text>
        </View>
      
          <TouchableOpacity onPress={abrirSacola}>
            <View style={styles.sacolaButton}>
              <Text style={{color:'#fff', fontSize:19}}>Ver sacola</Text>
            </View>
          </TouchableOpacity>
            
      </View>
      <Modal
      //visible={verSacola}
      onRequestClose={fecharSacola}
      animationType="slide">
        <ScrollView>
          <View style={{flexDirection:'row', marginTop:18, justifyContent:'space-between', paddingHorizontal:15 }}>
            <TouchableOpacity onPress={fecharSacola}>
              <Image source={require('../Home/icons/fechar.png')}/>
            </TouchableOpacity>
            <Text style={{fontSize:25, color:'#000'}}>SACOLA</Text>
            <TouchableOpacity>
              <Image source={require('../Home/icons/limpar.png')}/>
            </TouchableOpacity>
          </View>
          <Text style={{marginLeft:15, paddingTop:25, fontSize:23, color:'#000'}}>Itens Adicionados</Text>
          <View style={{ borderWidth: 0.3, backgroundColor: '#a6a6a6', width: '95%', alignSelf: 'center', marginTop: 13 }}></View>

      <View style={{flexDirection:'row', marginTop:15}}>
            <Image source={require('../Home/img/hamb-1.png')} style={{ width:100, height:100, borderRadius:15, marginLeft:10}}/>
          <View style={{flexDirection: 'column', marginLeft: 8, flex: 1}}>
            <Text style={{color:'#000', fontSize:18, marginTop:3 }}>Cheddar duplo</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{marginTop:3}}>Pão, carne, ovo, calabresa</Text>
            <Text style={{color:'#0b7402', fontSize:19, marginTop:17}}>R$ 26,90</Text>
          </View> 
          <View style={{flexDirection:'row', backgroundColor:'#d9d9d9', width:90, height:36, borderRadius:15, alignItems:'center', justifyContent:'space-between', paddingHorizontal:6,marginLeft:20, alignSelf:'center', marginRight:10}}>
            <Image source={require('./img/excluir.png')}/>
            <Text>1</Text>
            <Image source={require('./img/adicionar.png')}/>
          </View> 
      </View>

      <View style={{flexDirection:'row', marginTop:15}}>
            <Image source={require('../Home/img/hamb-1.png')} style={{ width:100, height:100, borderRadius:15, marginLeft:10}}/>
          <View style={{flexDirection: 'column', marginLeft: 8, flex: 1}}>
            <Text style={{color:'#000', fontSize:18, marginTop:3 }}>Cheddar duplo</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' style={{marginTop:3}}>Pão, carne, ovo, calabresa</Text>
            <Text style={{color:'#0b7402', fontSize:19, marginTop:17}}>R$ 26,90</Text>
          </View> 
          <View style={{flexDirection:'row', backgroundColor:'#d9d9d9', width:90, height:36, borderRadius:15, alignItems:'center', justifyContent:'space-between', paddingHorizontal:6,marginLeft:20, alignSelf:'center', marginRight:10}}>
            <Image source={require('./img/excluir.png')}/>
            <Text>1</Text>
            <Image source={require('./img/adicionar.png')}/>
          </View> 
      </View>
      
        </ScrollView>  
        <View style={{ marginBottom: 45}}>
            <Text style={{ marginLeft: 15, fontSize: 23, color: '#000', fontWeight: 'bold', marginBottom: 10 }}>Resumo de valores</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ marginLeft: 15, marginBottom: 5 }}>Subtotal</Text>
            <Text style={{ marginBottom: 5, marginRight:15 }}>R$ 14,99</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
            <Text style={{ marginLeft: 15, marginBottom: 5 }}>Taxa de entrega</Text>
            <Text style={{ marginBottom: 5, marginRight:15}}>R$ 4,00</Text>
          </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
          <Text style={{ marginLeft: 15, fontSize:20, color:'#000', fontWeight:'bold' }}>Total</Text>
          <Text style={{marginRight:15, fontSize:18, color:'#000', fontWeight:'bold'}}>R$ 14,99</Text>
        </View>
        </View>


      <View style={{backgroundColor:'#2aee99', flexDirection:'row', alignItems:'center'}}>
        <Text style={{marginLeft:15}}>Deseja editar o local de entrega?</Text>
        <TouchableOpacity>
          <View style={{flexDirection:'row', backgroundColor:'#ff3f5b', width:97, height:36, justifyContent:'space-between', alignItems:'center'}}>
            <Text>Editar</Text>
            <Image source={require('../Home/img/entrega.png')}/>
          </View>
        </TouchableOpacity>
      </View>
        
        
        <View style={styles.sacola}>
          <View>
        <Text style={{ marginLeft: 15, marginTop: 13, fontSize: 15 }}>Total sem a entrega</Text>
        <Text style={{ marginLeft: 15, fontSize: 22, fontWeight: 'bold', color: '#000' }}>R$ 10,00</Text>
          </View>
        </View>

      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
 
    
 
  location:{
    width:'99%',
    height:'90%',
    backgroundColor:'#d9d9d9',
    alignSelf:'center',
    borderRadius:15, 
    marginTop:8, 
    marginBottom:8,
    justifyContent:"space-between",
    alignItems:'center',
    flexDirection:'row',
  },
  
  locationimg:{
    height:35, 
    width:35, 
    marginLeft:8,
    marginEnd:8
  },
  listendereco:{
    backgroundColor:'#ffffff',
    width:'90%',
    height:50,
    borderRadius:15,
    marginTop:23

  },
  inputtext:{
    marginStart:10,
    width:'85%', 
    fontSize:18
  },
  textCategoria:{
    fontSize:25,
    color:'#000',
    paddingLeft:15,
    paddingTop:7
  },
  menu: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxHeight:45
  },
  menuItem: {
    marginRight: 20,
  },
  menuItemSelected: {
    borderBottomWidth: 2,
    borderColor: '#5a5555',
  },
  menuItemText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItemSelectedText: {
    color: '#0e0d0d',
  },
  list:{
    marginTop:8
  },
  imagem:{
    height:160,
    width:160,
    marginRight:10,
    borderRadius:15,
    marginStart:10,
    marginTop:8
  },
  preco:{
    fontSize:20,
    fontWeight:'bold',
    color:'#000',
    paddingLeft:5,
    marginStart:10
  },
  nome:{
    fontSize:18,
    color:'#000',
    paddingLeft:5,
    flexWrap:'wrap',
    maxWidth: 160,
    marginStart:10
  },
  modalImagem: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  modalNome: {
    marginTop:15,
    marginLeft:15,
    fontSize: 25,
    color:'#000'
  },
  modaldescricao:{
    fontSize:16,
    color:'#807a7a',
    marginLeft:15,
  },
  modalPreco: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:15,
    color:'#000'
  },
  sacola:{
    width:'100%',
    height:'10%',
    borderTopWidth:1,
    borderColor:'#a6a6a6',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  sacolaButton:{
    alignSelf:'center', marginRight:20, backgroundColor:'#ff3f5b', width:130, height:'60%', marginTop:15, borderRadius:15, alignItems:'center', justifyContent:'center'
  }
});