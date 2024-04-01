---
customLabelArray: [1, 3]
---

# <Label :level='1'/>TypeORM 基本使用

## 实体

```js
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // 自增主键
  id: number;

  @Column({ comment: '性别', type: 'enum', enum: SexRole, default: SexRole.BOY }) // 枚举
  sex: SexRole;

  @Column('simple-array') // 数组
  names: string[];

  @Column('simple-json') // 对象
  profile: { name: string, nickname: string };

  @Column({ unique: true }) // 唯一
  @Generated('uuid') // 自动生成列
  token: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @CreateDateColumn({ comment: '创建时间' }) // 自动生成列
  createdAt: string;

  @UpdateDateColumn({ comment: '更新时间' }) // 自动生成并自动更新列
  updatedAt: string;
}
```

## 增删改查

```js
const user = new User();
user.firstName = 'Timber';
user.lastName = 'Saw';
user.age = 25;
//  保存
await repository.save(user);
// 查找所有
const allUsers = await repository.find();
// 按id查找
const firstUser = await repository.findOne(1);
// 按条件查找一个
const timber = await repository.findOne({ firstName: 'Timber', lastName: 'Saw' });
// 关系查找(查找和该表关联的值)
const questions = await questionRepository.find({ relations: ['categories'] });
// 查找并计数
const count = await repository.findAndCount();
// 删除
await repository.remove(timber);
```

## 复杂查询

```js
// 1、find 操作
userRepository.find({
  select: ['firstName', 'lastName'], // 按属性查找
  relations: ['profile', 'photos', 'videos'], // 按关系查找
  where: {
    // 条件查询
    firstName: 'Timber',
    lastName: 'Saw'
  }, // 排序
  order: {
    name: 'ASC',
    id: 'DESC'
  },
  skip: 5, // 分页，跳过几项
  take: 10, // 分页，取几项
  cache: true
});

// 2、内置运算符查询（Not，LessThan，Equal，Like 等）

import { Like } from 'typeorm';
const loadedPosts = await connection.getRepository(Post).find({
  title: Like('%out #%') // 模糊查询，%表示任何字符出现任意次数 (可以是0次)，_只能匹配单个字符,不能多也不能少,就是一个字符
});
```

## 关系

### 1、一对一

一对一是一种 A 只包含一个 B 实例，而 B 只包含一个 A 实例的关系

```js
import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  photo: string;

  @OneToOne(type => User, user => user.profile) // 将另一面指定为第二个参数
  user: User;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(type => Profile, profile => profile.user，{cascade:true}) // 指定另一面作为第二个参数
  @JoinColumn()
  profile: Profile;
}
```

表 user 中，将新增一个 profileId 字段指向 profile 表中的 id 字段；

表 profile 中，不会新增 userId 字段

要加载带有 user 的 profile，必须在 FindOptions 中指定关系

```js
const profileRepository = connection.getRepository(Profile);
const profiles = await profileRepository.find({ relations: ['user'] });

// or from inverse side
const userRepository = connection.getRepository(User);
const users = await userRepository.find({ relations: ['profile'] });
```

### 2、多对一/一对多

多对一/一对多是指 A 包含多个 B 实例的关系，但 B 只包含一个 A 实例

```js
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(type => User, user => user.photos，{cascade:true})
  user: User;
}
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Photo } from "./Photo";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => Photo, photo => photo.user，{cascade:true})
  photos: Photo[];
}
```

设置@ManyToOne 的地方，相关实体将有"关联 id"和外键

表 photo 中，将新增一个 userId 字段指向 user 表中的 id 字段；

表 user 中，不会新增 photos 字段

要加载带有 photos 的 user，必须在 FindOptions 中指定关系

```js
const userRepository = connection.getRepository(User);
const users = await userRepository.find({ relations: ['photos'] });

// or from inverse side
const photoRepository = connection.getRepository(Photo);
const photos = await photoRepository.find({ relations: ['user'] });
```

### 3、多对多

多对多是一种 A 包含多个 B 实例，而 B 包含多个 A 实例的关系

```js
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Question } from './Question';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany((type) => Question, (question) => question.categories)
  questions: Question[];
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './Category';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @ManyToMany((type) => Category, (category) => category.questions)
  @JoinTable()
  categories: Category[];
}
```

@JoinTable()是@ManyToMany 关系所必需的。 你必须把@JoinTable 放在关系的一个（拥有）方面
