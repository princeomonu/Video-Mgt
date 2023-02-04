

var app = new Vue({
    el: '#app',
    data: {
        serverURL:'http://localhost:5000',
        title:'',
        file: null,
        videos: []
    },
    methods: {
        fetchVideos: async function () {
            const res = await fetch(`${this.serverURL}/all`)
            const videos  = await res.json()
            console.log({videos})
            this.videos = videos.reverse().map(video=>({
                ...video,
                url:`${this.serverURL}/stream/${video.file}`
            }))
        },
        uploadVideo: async function (){
            let input = this.$refs.fileInput
            let file = input.files[0]

            console.log('uploading...',this.title, file)


            const formData = new FormData()
            formData.append('video', file)
            formData.append('title',this.title)
      
            const response = await fetch(`${this.serverURL}/upload`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            console.log(data);

            // clear inputs
            this.title = ""
            this.$refs.fileInput.value = null;

            // refresh 
            this.fetchVideos();

        },
        deleteVideo: async function(id){
            console.log('delete video',id)

            const video = this.videos.find(video=>video._id==id)

            const yes  = confirm(`do you wish to delete "${video.title}"?`)
            if(!yes) return 
            
            const res = await fetch(`${this.serverURL}/${id}`,{
                method:'DELETE'
            })
            console.log({result:await res.json()})
            // refresh
            this.fetchVideos()
        }
    }
})

// initillize

app.fetchVideos()