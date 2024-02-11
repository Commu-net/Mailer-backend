/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import mongoose, { ObjectId } from "mongoose";
interface userI extends mongoose.Document {
    _id: ObjectId;
    name: string;
    email: string;
    sub?: number;
    picture?: string;
    domain?: string;
    googleId?: string;
    acessToken?: string;
    rToken?: string;
    id?: string;
    emailSelected?: mongoose.Schema.Types.ObjectId[] | null;
}
interface emailI extends mongoose.Document {
    email: string;
    name?: string;
    currentDesignation?: string;
    addedOn?: Date;
}
type userInterface = userI;
type emailInterface = emailI;
declare const User: mongoose.Model<{
    name: string;
    email: string;
    emailSelected: mongoose.Types.ObjectId[];
    sub?: number | null | undefined;
    picture?: string | null | undefined;
    domain?: string | null | undefined;
    googleId?: string | null | undefined;
    acessToken?: string | null | undefined;
    rToken?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    emailSelected: mongoose.Types.ObjectId[];
    sub?: number | null | undefined;
    picture?: string | null | undefined;
    domain?: string | null | undefined;
    googleId?: string | null | undefined;
    acessToken?: string | null | undefined;
    rToken?: string | null | undefined;
}> & {
    name: string;
    email: string;
    emailSelected: mongoose.Types.ObjectId[];
    sub?: number | null | undefined;
    picture?: string | null | undefined;
    domain?: string | null | undefined;
    googleId?: string | null | undefined;
    acessToken?: string | null | undefined;
    rToken?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    email: string;
    emailSelected: mongoose.Types.ObjectId[];
    sub?: number | null | undefined;
    picture?: string | null | undefined;
    domain?: string | null | undefined;
    googleId?: string | null | undefined;
    acessToken?: string | null | undefined;
    rToken?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    name: string;
    email: string;
    emailSelected: mongoose.Types.ObjectId[];
    sub?: number | null | undefined;
    picture?: string | null | undefined;
    domain?: string | null | undefined;
    googleId?: string | null | undefined;
    acessToken?: string | null | undefined;
    rToken?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    name: string;
    email: string;
    emailSelected: mongoose.Types.ObjectId[];
    sub?: number | null | undefined;
    picture?: string | null | undefined;
    domain?: string | null | undefined;
    googleId?: string | null | undefined;
    acessToken?: string | null | undefined;
    rToken?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
declare const Email: mongoose.Model<{
    email: string;
    addedOn: Date;
    name?: string | null | undefined;
    currentDesignation?: string | null | undefined;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    email: string;
    addedOn: Date;
    name?: string | null | undefined;
    currentDesignation?: string | null | undefined;
}> & {
    email: string;
    addedOn: Date;
    name?: string | null | undefined;
    currentDesignation?: string | null | undefined;
} & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    addedOn: Date;
    name?: string | null | undefined;
    currentDesignation?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    email: string;
    addedOn: Date;
    name?: string | null | undefined;
    currentDesignation?: string | null | undefined;
}>> & mongoose.FlatRecord<{
    email: string;
    addedOn: Date;
    name?: string | null | undefined;
    currentDesignation?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
}>>;
export { User, Email, userInterface, emailInterface };
