<template>
    <div ref="studentPage">
        <section class="p-5">
            <div class="flex justify-content-between gap-8">
                <div class="flex flex-auto gap-5">
                    <p-skeleton v-if="student.loading" width="96px" height="96px" />
                    <nuxt-img
                        v-else
                        :src="
                            student.data?.gender === 'FEMALE'
                                ? 'images/avatars/persona 0-1.png'
                                : 'images/avatars/persona 0-0.png'
                        "
                        alt="student avatar"
                        width="96"
                        height="96"
                    />
                    <div class="flex flex-auto flex-column justify-content-between">
                        <div class="flex align-items-center text-3xl h-2rem">
                            <p-skeleton v-if="student.loading" class="max-w-30rem" />
                            <div v-else class="text-800 font-bold">
                                {{ student.data?.secondName }}
                                {{ student.data?.firstName }}
                                {{ student.data?.middleName }}
                            </div>
                        </div>
                        <div class="flex flex-wrap gap-5">
                            <div class="flex flex-column">
                                <div class="text-500">Дата рождения</div>
                                <div class="flex align-items-end h-1rem mt-2 text-700">
                                    <p-skeleton v-if="student.loading" class="max-w-30rem" />
                                    <div v-else>{{ new Date(student.data?.birthdate!).toLocaleDateString() }}</div>
                                </div>
                            </div>
                            <div class="flex flex-column w-5rem">
                                <div class="text-500">Пол</div>
                                <div class="flex align-items-end h-1rem mt-2 text-700">
                                    <p-skeleton v-if="student.loading" class="max-w-30rem" />
                                    <div v-else>{{ genderLocalization[student.data?.gender!] }}</div>
                                </div>
                            </div>
                            <div class="flex flex-column">
                                <div class="text-500">Класс</div>
                                <div class="flex align-items-end h-1rem mt-2 text-700">
                                    <p-skeleton v-if="student.loading" class="max-w-30rem" />
                                    <div v-else>{{ student.data?.class.number! + student.data?.class.liter! }}</div>
                                </div>
                            </div>
                            <div class="flex flex-column w-9rem">
                                <div class="text-500">СНИЛС</div>
                                <div class="flex align-items-end h-1rem mt-2 text-700">
                                    <p-skeleton v-if="student.loading" class="max-w-30rem" />
                                    <div v-else>{{ student.data?.snils }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <role-access role="CLASS_TEACHER">
                        <p-button icon="pi pi-print" class="p-button-rounded p-button-secondary" />
                    </role-access>
                    <role-access role="CLASS_TEACHER">
                        <p-button icon="pi pi-file-pdf" class="p-button-rounded p-button-secondary" />
                    </role-access>
                    <role-access role="CLASS_TEACHER">
                        <p-button
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger"
                            @click="confirmDeleteStudent($event)"
                        />
                        <p-confirm-popup></p-confirm-popup>
                    </role-access>
                </div>
            </div>
        </section>
        <role-access role="HEALTH_WORKER">
            <health-medical />
        </role-access>
        <role-access role="PEDAGOGUE">
            <health-pedagogue />
        </role-access>
        <role-access role="PHYSICAL_EDUCATION_TEACHER">
            <health-physical />
        </role-access>
        <role-access role="PSYCHOLOGIST">
            <health-psychological />
        </role-access>
        <role-access role="SOCIAL_PEDAGOGUE">
            <health-social />
        </role-access>
        <role-access role="CLASS_TEACHER">
            <health-class-teacher />
        </role-access>
        <role-access role="OPERATOR">
            <health-route />
        </role-access>
    </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import shortUUID from 'short-uuid'
import { Gender } from '@prisma/client'
import { useStudentStore } from '~~/store/student'
import { useClassStore } from '~~/store/class'

definePageMeta({
    title: 'Информация по учащемуся',
    breadcrumb: 'student'
})

const toast = useToast()
const confirm = useConfirm()

const route = useRoute()
const router = useRouter()

const studentPage = ref<HTMLElement>()
const translator = shortUUID()

const student = useStudentStore()
const currentClass = useClassStore()

student.setId(translator.toUUID(route.params.studentId as string))
currentClass.setId(translator.toUUID(route.params.classId as string))

const genderLocalization: { [key in Gender]: string } = {
    MALE: 'Мужской',
    FEMALE: 'Женский'
}

async function confirmDeleteStudent(event: MouseEvent) {
    confirm.require({
        target: event.currentTarget as HTMLElement,
        icon: 'pi pi-info-circle',
        message: 'Вы действительно хотите удалить учащегося?',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await deleteStudent()
            toast.add({
                severity: 'success',
                summary: 'Успешно',
                detail: 'Учащийся удалён',
                life: 3000
            })
        }
    })
}

async function deleteStudent() {
    const { error } = await useFetch('/api/students/remove', {
        method: 'DELETE',
        body: { studentId: student.data?.id }
    })
    if (error.value) {
        return toast.add({
            severity: 'error',
            summary: 'Ошибка удаления',
            detail: 'Данные не были удалены',
            life: 3000
        })
    }

    router.back()
}
</script>
