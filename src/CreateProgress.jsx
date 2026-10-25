import { useState } from "react"
import axios from "axios"

const CreateProgress = ()=> {
    const [البيانات, ضبط_البيانات]= useState({
        juz : "",
        surah: "",
        catatan: "",
    })
    const إرسال= async (الحدث)=>{
        الحدث.preventDefault()
        const رمز_المصادقة = localStorage.getItem('token')
        // const userToken = JSON.parse(user)
        try {
            const الاستجابة = await  axios.post("http://localhost:3000/api/reading/progress", البيانات, {
                headers:{
                    Authorization: `Bearer ${رمز_المصادقة}`
                }
            })
            const النتيجة = الاستجابة.data
            console.log("ini hasilnya", النتيجة)
            ضبط_البيانات({
                juz : "",
                surah: "",
                catatan: "",
            })
        } catch (الخطأ) {
            console.log("error saat submit", الخطأ.message)
            
        }
    }
    const معالجة_التغيير = (الحدث) => {
        const { name: الاسم, value: القيمة } = الحدث.target;
        ضبط_البيانات({ ...البيانات, [الاسم]: القيمة });
      };
    return (
        <div>
            
            <div>
                <form onSubmit={إرسال}>

                    <div >
                        <h1>BUAT AKUN DULU!</h1>
                        <div >
                            <input type="text" name="juz" value={البيانات.juz} onChange={معالجة_التغيير}
                                 />
                        </div>
                        <div>
                            <input type="text" name="surah" value={البيانات.surah} onChange={معالجة_التغيير}
                               />
                        </div>
                        <div >
                            <input type="text" name="catatan" value={البيانات.catatan} onChange={معالجة_التغيير}
                                />
                        </div>
                        <div >
                            <button type="submit">submit</button>
                        </div>
                        <p></p>
                    </div>
                </form>
            </div>

        </div>

    )
}
export default CreateProgress