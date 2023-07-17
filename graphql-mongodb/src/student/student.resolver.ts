import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { StudentType } from "./student.type";
import { StudentService } from "./student.service";
import { CreateStudentInput } from "./student.input";

@Resolver(of => StudentType)
export class StudentResolver {
    constructor(
        private studentService: StudentService,
    ) {}

    @Mutation(returns => StudentType)
    async createStudent(@Args('createStudentInput') createStudentInput: CreateStudentInput,) {
        return this.studentService.createStudent(createStudentInput);
    }

    @Query(returns => StudentType)
    async student(@Args('id') id: string) {
        return this.studentService.getStudent(id);
    }

    @Query(returns => [StudentType])
    async students() {
        return this.studentService.getStudents();
    }

}