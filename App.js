import React, {useState, useCallback, useEffect} from 'react';
import { View, Text, StyleSheet,  SafeAreaView, StatusBar,
   TouchableOpacity, FlatList, Modal, TextInput, AsyncStorage} from 'react-native';
import  { Ionicons} from '@expo/vector-icons';
import TaskList from './src/components/TaskList/';
import * as Animatable from 'react-native-animatable';


const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {
   
  const [task, setTask] = useState([]);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');

//Buscando todas as tarefas ao executar o app
useEffect(()=>{
  async function loadTasks(){
    const taskStorage = await AsyncStorage.getItem('@task');

    if(taskStorage){
      setTask(JSON.parse(taskStorage));
    }
  }

    loadTasks();
}, []);

// salvando caso tenha alguma tarefa alterada
useEffect(()=>{
  async function saveTasks(){
    await AsyncStorage.setItem('@task', JSON.stringify(task));
  }
    saveTasks();
}, [task]);



  function handleAdd(){
    if(input === '') return;

    const data = {
      key: input,
      task: input
    }; 
    setTask([...task, data]);
    setOpen(false);
    setInput('');
  }


 const handleDelete = useCallback((data)=>{
     const find = task.filter(r => r.key !== data.key);
     setTask(find);
 })


  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#202020" barStyle="light-content" />
          
          <View style={styles.content}>
             <Text style={styles.title}>Minhas Tarefas</Text>
         </View>

      <FlatList
         marginHorizontal={10}
         showsHorizontalScrollIndicator={false}
         data={task}
         keyExtractor={(item)=> String(item.key)}
         renderItem={({item})=> <TaskList data={item} handleDelete={handleDelete} />}
      />

     

    <Modal animationType="slide" transparent={false} visible={open}>

      <SafeAreaView style={styles.modal}>

         <View style={styles.modalHeader} > 
             <TouchableOpacity onPress={() => setOpen(false) }>
                 <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={40} color="#FFF"/>
             </TouchableOpacity>
             <Text style={styles.modalTitle}>Nova Tarefa</Text>
         </View>

           <Animatable.View style={styles.modalBody} animation="fadeInUp" useNativeDriver >
               <TextInput
                 multiline={true}
                 placeholderTextColor="#a5a4a9"
                 autoCorrect={false}
                 style={styles.Input}
                 placeholder="O que precisa fazer hoje?"
                 value={input}
                 onChangeText={(texto)=> setInput(texto)}
               />

               <TouchableOpacity style={styles.handleAdd} onPress={handleAdd}>
                   <Text style={styles.handleAddText}>Salvar</Text>
               </TouchableOpacity>

           </Animatable.View>

      </SafeAreaView>

    </Modal>


      <AnimatedBtn 
      style={styles.fab}
      useNativeDriver
      animation="bounceInUp"
      duration={1500}
      onPress={ () => setOpen(true) }
      >
         <Ionicons name="ios-add" size={35} color="#FFF" />
      </AnimatedBtn>
        

    </SafeAreaView>
     
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },

  title:{
    marginTop: 10,
    paddingBottom: 10,
    fontSize: 20,
    textAlign: 'center',
    color:'#FFF'
  },

  fab:{

    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#8257e5' ,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height: 3,
      }
    },
    modal: {
      flex: 1,
      backgroundColor: '#202020'
    },
    
    modalHeader: {
     marginLeft: 10,
     marginTop: 20,
     flexDirection: 'row',
     alignItems: 'center'
    },
    
    modalTitle: {
     marginLeft: 15,
     fontSize: 20,
     color: '#FFF',
    },

    modalBody: {
      marginTop: 15,
    },

    Input: {
      fontSize: 15,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 30,
      backgroundColor: '#36393f',
      padding: 9,
      height: 100,
      textAlignVertical: 'top',
      color: '#FFF',
      borderRadius: 5,
    },

    handleAdd: {
      backgroundColor: '#8257e5',
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
      marginRight: 10,
      height: 40,
      borderRadius: 5,
    },

    handleAddText: {
      fontSize: 20,
      color: 'white'
    }


});







