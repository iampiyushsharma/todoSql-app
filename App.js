
import { TextInput,FlatList, StyleSheet, Text, View ,TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [n, setN] = useState('')
  const[ updateTask, setUpdateTask] = useState(false);
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await axios.get('https://todosql.onrender.com/')
      //console.log(response)
      setTasks(response.data)
    } catch (error) {
     // console.error(error)
    }
  }

  const createTask = async () => {
    try {
      const response = await axios.post('https://todosql.onrender.com/', { title: newTask })
      console.log('====================================');
      //console.log(response);
      console.log('====================================');
      setTasks([...tasks, response.data]);
      setNewTask('')
      fetchTasks();
    } catch (error) {
      console.error(error)
    }
  }

  const deleteTask = async (taskId) => {
    //console.log(taskId);
    try {
      await axios.delete(`https://todosql.onrender.com/`, { data:{id: taskId} })
      fetchTasks();
    } catch (error) {
      console.error(error)
    }
  }
  const updateU = async (taskId) => {
    setUpdateTask(true);
    setN(taskId);
  }

  const update = async (taskId) => {
    try {
      const response = await axios.patch('https://todosql.onrender.com/', {title: newTask, id: taskId} )
      setTasks([...tasks, response.data]);
      //setNewSn('')
      setNewTask('')
      //setNewDes('')
      fetchTasks();
    } catch (error) {
      console.error(error)
    }
  }
  const pressHandler = () => {
    if(updateTask){
      update(n);
    } else {
      createTask();
    }
    // updateTask ? () => update(n) : createTask();
  }
  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: 'gray', borderWidth: 1, borderRadius: 5, padding: 10, marginBottom: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => deleteTask(item.id)} style={{ backgroundColor: 'black', padding: 5, borderRadius: 5, marginRight: 5 }}>
          <Text style={{ color: 'white' }}>❌</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => updateU(item.id)} style={{ backgroundColor: 'black', padding: 5, borderRadius: 5 }}>
          <Text style={{ color: 'white' }}>📝</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Task Manager</Text>
        </View>
        <View style={styles.taskList}>
          <View style={styles.taskContainer}>
            <FlatList
              key={Math.random()*1000000}
              data={tasks}
              keyExtractor={(item) => item.sn} // Assuming sn is a number
              renderItem={renderItem}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            type='text'
            value={newTask}
            onChangeText={setNewTask}
            style={[styles.input, { borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}
          />
          <TouchableOpacity
            onPress={pressHandler}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>{updateTask ? 'Update Task' : 'Add Task'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
    );

  }
  const styles = StyleSheet.create({
    container: {
      paddingTop: 50,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    taskList: {
      flex: 1,
      width: '80%',
    },
    taskContainer: {
      marginBottom: 10,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    input: {
      width: '50%',
    },
    addButton: {
      backgroundColor: '#4285f4',
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    buttonText: {
      color: 'white',
    },
  });
