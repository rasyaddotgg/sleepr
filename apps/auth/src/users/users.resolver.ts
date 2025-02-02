import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserDocument } from './models/users.schema';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Resolver(() => UserDocument)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserDocument)
  createUser(@Args('createUserInput') createUserInput: CreateUserDto) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [UserDocument])
  findAll() {
    return this.usersService.findAll();
  }
}
